'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const automl = require('@google-cloud/automl');
const predictionClient = new automl.PredictionServiceClient();
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const sizeOf = require('image-size');
const fs = require('fs');
const path = require('path');
const os = require('os');
const mkdirp = require('mkdirp-promise');
const exec = require('child_process').exec;
const mime = require('mime-types')
const annotatorClient = new vision.ImageAnnotatorClient();
const project = 'mooie-man';
const region = 'us-central1';
const automl_model = 'ICN4428727672790743256'; // 'ICN829523746380525909';
const serviceAccount = require('./.secret/mooie-man-9dcf8a229f3f');
const corsHandler = require('cors')({ origin: true });
const dev = Boolean(process.env.FUNCTIONS_EMULATOR);
const storage = new Storage();
const bucketUrl = dev
    ? './test-images/' // used after `firebase serve`
    : 'https://firebasestorage.googleapis.com/v0/b/mooie-man.appspot.com/o/'; // used after `firebase deploy`
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
var db = admin.firestore();
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandom(min, max) {
    return Math.random() * (max - min) + min
}
function getRandomPaddedInt(min, max, pad = 4) {
    return String(getRandomInt(min, max)).padStart(pad, '0')
}

const sharp = require('sharp');
function resizeImg(filePath, width = 1920, height = 1080) {
    return sharp(filePath).resize(width, height, { fit: 'inside', withoutEnlargement: true })
}

function callAutoMLAPI(b64img) {
    return new Promise((resolve, reject) => {
        const payload = {
            "image": {
                "imageBytes": b64img
            }
        }
        const reqBody = {
            name: predictionClient.modelPath(project, region, automl_model),
            payload: payload
        }
        predictionClient.predict(reqBody)
            .then(responses => {
                console.log('Got a prediction from AutoML API!');
                resolve(responses);
                return responses
            })
            .catch(err => {
                console.log('AutoML API Error: ', err);
                reject(err);
            });
    });
}
function callVisionAnnotator(b64img) {

    return new Promise((resolve, reject) => {
        const payload = {
            "image": {
                "content": b64img
            }
        }
        annotatorClient.faceDetection(payload)
            .then(responses => {
                console.log('Got a prediction from Vision API!');
                resolve(responses);
                return responses
            })
            .catch(err => {
                console.log('Vision API Error: ', err);
                reject(err);
            });
    });
}


/**
 * Outputs either fraaievrouw or mooieman based on user input
 * strips forward slashes from userinput
 * automaticly guesses if user input is malformed, doesn't care about special-characters
 *
 * @param {string} input the request params
 * @returns
 */
function fraaiOrMooi(_input) {
    const options = ['fraaievrouw', 'mooieman']
    const input = Object.values(_input)
        .join('')
        .replace(/[^A-Za-z]/g, "") // may only be letters
    const found = options.indexOf(input);
    if (found !== -1) {
        return options[found]
    }
    // mitigate the not-found by intersecting each character and finding a good candidate
    const splitInput = input.split('') // is pre-splitted for later repeated use
    return options.reduce((arr, string) => {
        arr.push({
            string,
            // get the amount of mismatched characters relative to string
            mismatched: string.length - string.split('').filter(x => splitInput.indexOf(x) === -1).length
        })
        return arr
    }, []).sort(
        (a, b) => b.mismatched - a.mismatched // sort least mismatching first
    )[0].string // return first string
}

function whichInteger(_input, max) {
    const int = parseInt(Object.values(_input).join('').replace(/\D/g, '')) // may only be a integer
    if (dev) max = 3;
    if (isNaN(int) || int > max) return getRandomInt(1, max) // random fallbackk
    return int
}

const requestLib = require('request');
async function _get(request, response) {
    const documentName = fraaiOrMooi(request.params);
    const max = await db.collection('stats').doc(documentName).get('count');
    const prefix = `${documentName}${String(whichInteger(request.params, max.data().count)).padStart(4, '0')}`
    console.log('get', prefix, max.data().count)
    if (!dev) {
        const [files] = await admin.storage().bucket().getFiles({ maxResusult: 1, prefix: prefix })
        if (files.length === 0) {
            return response.status(404).json('Image Not Found')
        }
        const url = "https://firebasestorage.googleapis.com/v0/b/mooie-man.appspot.com/o/" + files[0].name + "?alt=media"
        requestLib.head(url, (err, res, body) => {
            if (err) {
                response.status(404).json(err)
            }
            response.setHeader('Content-Type', res.headers['content-type']);
            requestLib(url).pipe(response);
        });
    } else {
        const prefix = `${documentName}${String(whichInteger(request.params, max)).padStart(4, '0')}`
        fs.readFile('./test-images/' + prefix + '.jpg', (err, content) => {
            if (err) {
                console.warn(err);
                response.writeHead(400, { 'Content-type': 'text/html' })
                response.end("No such image");
            } else {
                response.writeHead(200, { 'Content-type': 'image/jpg' });
                response.end(content);
            }
        });
    }
    return response
}

const uploadNewFileFromStream = (bucketName) => (id, type) => (readStream) => {
    // const fileName = `spot_images_tests/${id}.jpg`
    if (!type) type = 'mooieman'
    const fileName = `${type}/${id}.webp`;
    const bucket = admin.storage().bucket(bucketName);
    const file = bucket.file(`/${fileName}`); // file to be generated
    const writeStream = file.createWriteStream({
        metadata: {
            contentType: 'image/webp'
        }
    });
    const result = new Promise((resolve, reject) => {
        writeStream.on('error', (err) => {
            reject(err);
        });
        writeStream.on('finish', () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${(encodeURI(fileName)).replace("/", "%2F")}`;
            resolve(publicUrl);
        });
    });
    readStream.pipe(writeStream);
    return result;
};
const getStreamFromUrl = (url) => {
    return requestLib(url);
};

const uploadNewFile = (bucket) => (id, type, stream) => uploadNewFileFromStream(bucketName)(id, type)(stream)
const uploadNewPictureFromUrl = (bucket) => (id, type, url) => uploadNewFileFromStream(bucketName)(id, type)(getStreamFromUrl(url))

async function _getRealFileCount(type) {
    const [files] = await admin.storage().bucket().getFiles({ prefix: type, directory: `/${type}` })
    db.collection('stats').doc(type).set({ files: files.length, lastUpdated: admin.firestore.Timestamp.now() }, { merge: true })
    if (dev) console.log(`set files ${type} count`)
    return files.length;
}

async function _getCount(type) {
    let countDoc = await db.collection('stats').doc(type).get();
    if (!countDoc.exists) return _getRealFileCount(type)
    return countDoc.data().count
}

async function _incrementCount(type) {
    const increment = admin.firestore.FieldValue.increment(1);
    return db.collection('stats').doc(type).set({ count: increment }, { merge: true });
}


async function _count(request, response) {
    const documentName = fraaiOrMooi(
        Object.values(request.params).join('/').split('/').join('').toLowerCase().split(''), // param may be abused i.e. '/fraaie/vrouw', '/mooie/man' )
        'fraaievrouw',
        'mooieman'
    );
    let max = await _getCount(documentName);
    return response.json(String(max));
}

const IMAGE_VERSIONS = [{
    type: 'large',
    width: 1920,
    height: 1080
},
{
    type: 'normal',
    width: 1024,
    height: 768
},
{
    type: 'thumb',
    width: 400,
    height: 250
},
]
const Busboy = require('busboy');

function deleteFile(destination) {
    if (fs.existsSync(destination)) fs.unlinkSync(destination, (err) => {
        if (err) {
            console.log('Error deleting file', e)
        }
    });
}
/**
 * Handles request and response for _uploadManual requests
 */
async function _uploadManual(request, response) {
    if (request.method !== 'POST') {
        // Return a "method not allowed" error
        return response.status(405).end();
    }
    const data = await _uploadBusboy({headers:request.headers}, request.rawBody);
    return response.json(data).send();
}
/**
 * The first argument tempfile path or
 * a event object from firebase.functions.onFinalize.
 * If the image is not found in tempfolder, a attempt to download
 * the image from the bucket will be made with a signed url.
 * 
 * The second argument may be used to further limit the initial image size.
 * This is needed as to not overload the AutoML function
 * 
 * It's return value is a object with some handy values
 * - bitmap stream
 * - metadata object with contentType set
 * - fileName
 * - bucket it is stored in
 * - sizeOf results
 * 
 * @param event    string|object
 * @param maxSize  number (1024)
 * @return {bitmap,metadata,fileName,bucket}
 */
async function _paramsToBitmap(event, maxSize = 1024) {
    const isManual = typeof event === 'string';
    const fileBucket = event.bucket ? event.bucket : "mooie-man.appspot.com"; // The Storage bucket that contains the file.
    const filePath = event.name ? event.name : event; // File path in the bucket.
    const contentType = event.contentType ? event.contentType : mime.lookup(filePath); // File content type.
    const metadata = { contentType };
    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
        console.log('This is not an image.', event);
        return null;
    }

    const fileName = path.basename(filePath);
    // Exit if the image is already prefixed.
    if (fileName.startsWith('thumb_')) {
        console.log('Already a Thumbnail.');
        return null;
    }
    if (fileName.startsWith('normal_')) {
        console.log('Already a normal.');
        return null;
    }
    const bucket = storage.bucket(fileBucket);
    let destination = (!isManual) ? '/tmp/' + filePath.replace(/\s/g, '') : filePath;
    let signedUrl;
    let bitmap;
    let sizes = {}
    try {
        if (dev) console.log('checking file exist', fileName)
        if (!fs.existsSync(destination)) {
            if (dev) console.log('download file')
            signedUrl = await bucket.file(fileName).getSignedUrl({
                action: 'read',
                expires: Date.now() + 5 * 60 * 1000,
            })
            if (!signedUrl[0]) {
                console.warn('signed url could not be retrieved', signedUrl)
                return null;
            }
            if (dev) console.log('signedUrl', signedUrl[0])
            await bucket.file(exists[0]).download({ destination });
            if (!fs.existsSync(destination)) {
                console.warn('file still does not exist', exists)
                return null;
            }
        }
        sizes = sizeOf(destination)
        sizes.maxSize = maxSize;
    } catch (e) {
        if (dev) console.log('failed upload', e)
        deleteFile(destination)
    }
    return { tempfile: destination, metadata, fileName, bucket, sizes }
}
const crypto = require('crypto')
async function bitmapToBucket(imageBitmap) {
    const { model, id } = await bitmapToModel(imageBitmap)
    let { tempfile, metadata, fileName, bucket, sizes } = imageBitmap;
    if (dev) console.log('bitmapToBucket')
    let newFileName, originalFilePath, largeFilePath, mediumFilePath, thumbFilePath;
    // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream

    switch (model.type) {
        case 'mooieman':
        case 'fraaievrouw':
            if (dev) console.log('getting count', model.type)
            let count = await _getCount(model.type)
            if (dev) console.log('got count', model.type)
            if (dev) console.log('piping file', fileName)
            newFileName = `${model.type + String(count).padStart(4, '0')}.${sizes.type}`
            largeFilePath = `${model.type}/${newFileName}`;
            originalFilePath = `${model.type}/${id}.${sizes.type}`;
            const originalUploadStream = bucket.file(originalFilePath).createWriteStream({ metadata })
            const largeUploadStream = bucket.file(largeFilePath).createWriteStream({ metadata })
            thumbFilePath = `${model.type}/${IMAGE_VERSIONS[2].type}_${newFileName}`;
            const thumbUploadStream = bucket.file(thumbFilePath).createWriteStream({ metadata })
            mediumFilePath = `${model.type}/${IMAGE_VERSIONS[1].type}_.${newFileName}`;
            const mediumUploadStream = bucket.file(mediumFilePath).createWriteStream({ metadata })
            if (dev) console.log('uploading file',model.md5)
            if (dev) console.log('uploading large')
            var bitmap = fs.createReadStream(tempfile)
            var pipeline = sharp().rotate();
            const promises = [
                new Promise((resolve, reject) => originalUploadStream.on('finish', resolve).on('error', reject)),
                new Promise((resolve, reject) => largeUploadStream.on('finish', resolve).on('error', reject)),
                new Promise((resolve, reject) => mediumUploadStream.on('finish', resolve).on('error', reject)),
                new Promise((resolve, reject) => thumbUploadStream.on('finish', resolve).on('error', reject))
            ]
            pipeline.clone()
                .resize(
                    IMAGE_VERSIONS[0].width, IMAGE_VERSIONS[0].height, { fit: 'inside', withoutEnlargement: true }
                ).pipe(largeUploadStream);
            pipeline.clone()
                .resize(
                    IMAGE_VERSIONS[1].width, IMAGE_VERSIONS[1].height, { fit: 'inside', withoutEnlargement: true }
                ).pipe(mediumUploadStream);
            pipeline.clone()
                .resize(
                    IMAGE_VERSIONS[2].width, IMAGE_VERSIONS[2].height, { fit: 'inside', withoutEnlargement: true }
                ).pipe(thumbUploadStream);
            pipeline.clone()
                .resize(
                    4000,4000, { fit: 'inside', withoutEnlargement: true }
                )
                .pipe(originalUploadStream);
            bitmap.pipe(pipeline)
            if (dev) console.log('awaiting uploads')
            await Promise.all(promises)
            if (dev) console.log('uploads went through')
            if (dev) console.log('adding info to model')
            await db.collection(model.type).doc(id).set({ imageId: id, path: largeFilePath, normal: mediumFilePath, thumb: thumbFilePath }, { merge: true })
            if (dev) console.log('image info added')
            break;
        case 'none':
        default:
            console.log('not uploading image')
            break;
    }
    
    if (dev) console.log('adding image to db')
    let doc = db.collection('images').doc(id)
    let docSnapshot = await doc.get()
    if (!docSnapshot.exists) {
        if (dev) console.log('new image')
        _incrementCount('images')
    } else if (dev) {
        console.log("updating a existing image")
    }
    await doc.set({
        model,
        filePath: largeFilePath,
        fileName: newFileName,
        originalFileName: fileName,
        originalFilePath: originalFilePath,
        modelId: id
    })
    if (dev) console.log('added image')
    return {
        model,
        fileName,
        image: id,
        type: model.type,
        largeFilePath,
        mediumFilePath,
        thumbFilePath
    };
}

async function _upload(event) {
    let model = {}
    const imageBitmap = await _paramsToBitmap(event, 1920)
    if (!imageBitmap) {
        console.warn('bitmap could not be retrieved')
        return
    }
    model = await bitmapToBucket(imageBitmap)
    if (dev) console.log('uploaded file')
    return model
}

/**
 * Checks is upload is Mooieman or Fraaievrouw
 *
 * @param {*} event
 * @returns
 */
async function bitmapToModel(imageBitmap) {
    const { tempfile, metadata } = imageBitmap
    const buffer = await resizeImg(tempfile, 600).toBuffer();
    let model = {}
    let data = buffer.toString('base64');
    if (dev) console.log('got bitmap')
    let response = await callAutoMLAPI(data);
    if (dev) console.log('got response', response[0]['payload'])
    let payload = response[0]['payload'];
    let predictionErr;
    let labels;
    // save all scores
    Object.values(payload).forEach(v => model[v.displayName] = v.classification.score);
    model.type = (payload[0].classification.score > 0.99) ? payload[0].displayName : 'none'
    // add image to image-collection and return id
    // add model to type's collection and return id
    if (dev) console.log('getting id')
    model.md5 = crypto.createHash('md5').update(data).digest("hex")
    if (dev) console.log('got id')
    if (typeof model.md5 !== 'string') {
        console.log('md5 is not a string', model.md5)
        return model
    }
    if (dev) console.log('switch type', model.type)
    switch (model.type) {
        case 'mooieman':
        case 'fraaievrouw':
            if (dev) console.log('calling vision api', data.length)
            labels = await callVisionAnnotator(data)
            if (dev) console.log('called vision api', data.length)
            model.faceAnnotations = labels[0].faceAnnotations[0];
            break;
        case 'none':
        default:
            if (Object.keys(payload).length === 0) {
                model.predictionErr = "No high confidence model found"
            } else if (parseFloat(payload[0].classification.score) < 0.99) {
                model.predictionErr = "Confidence not high enough:" + payload[0].classification.score
            }
            break;
    }
    let doc = db.collection(model.type).doc(model.md5)
    let docSnapshot = await doc.get()
    if (!docSnapshot.exists) {
        _incrementCount(model.type)
    }
    await doc.set(model)
    return { id: model.md5, model };
}

async function _callCustomModel(event) {
    const imageBitmap = await _paramsToBitmap(event, 600)
    if (!imageBitmap) {
        console.warn('bitmap could not be retrieved')
        return
    }
    const { model } = await bitmapToModel(imageBitmap)
    return model
}

exports.upload = functions.storage.object().onFinalize(_upload);
exports.uploadManual = functions.https.onRequest(_uploadManual);
exports.callCustomModel = functions.storage.bucket('mooie-man-vcm').object().onFinalize(_callCustomModel);
exports.get = functions.https.onRequest(_get);
exports.count = functions.https.onRequest(_count);
exports.mooieman = functions.https.onRequest((request, response) => {
    request.params[1] = '/mooieman'
    return _get(request, response)
});
exports.fraaievrouw = functions.https.onRequest(async (request, response) => {
    request.params[1] = '/fraaievrouw'
    return _get(request, response)
});
exports.mooiemanCount = functions.https.onRequest(async (request, response) => {
    request.params[1] = '/mooieman'
    return _count(request, response)
});
exports.fraaievrouwCount = functions.https.onRequest(async (request, response) => {
    request.params[1] = '/fraaievrouw'
    return _count(request, response)
});
