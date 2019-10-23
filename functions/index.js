const functions = require('firebase-functions');
const admin = require('firebase-admin');
const automl = require('@google-cloud/automl');
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const sizeOf = require('image-size');
const fs = require('fs');
const os = require('os');
const mkdirp = require('mkdirp-promise');
const exec = require('child_process').exec;
const predictionClient = new automl.PredictionServiceClient();
const annotatorClient = new vision.ImageAnnotatorClient();
const project = 'mooie-man';
const region = 'us-central1';
const automl_model = 'ICN4428727672790743256'; // 'ICN829523746380525909';
const serviceAccount = require('./mooie-man-firebase-adminsdk-byq6j-ac788928ec.json');
var corsHandler = require('cors')({ origin: true });
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    apiKey: "AIzaSyDx-gprPvpaTekleCuFD2L_mSf_3DXPSCE",
    databaseURL: "https://mooie-man.firebaseio.com",
    projectId: "mooie-man",
    storageBucket: "mooie-man.appspot.com",
    messagingSenderId: "712855408222",
    appId: "1:712855408222:web:b7ede5d7e3152124dceecf",
    measurementId: "G-HEJZ8V66N1"
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
var db = admin.firestore();
var bucket = storage.bucket('mooie-man-vcm');
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

function resizeImg(filepath) {
    return new Promise((resolve, reject) => {
        exec(`convert ${filepath} -resize 600x ${filepath}`, (err) => {
            if (err) {
                console.error('Failed to resize image', err);
                reject(err);
            } else {
                console.log('resized image successfully');
                resolve(filepath);
            }
        });
    });
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
                console.log('Got a prediction from AutoML API!', JSON.stringify(responses));
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
                console.log('Got a prediction from Vision API!', JSON.stringify(responses));
                resolve(responses);
                return responses
            })
            .catch(err => {
                console.log('Vision API Error: ', err);
                reject(err);
            });
    });
}

async function checkUpload(event) {
    const file = storage.bucket(event.bucket).file(event.name);
    let destination = '/tmp/' + event.name.replace(/\s/g, '');
    let predictions = {}
    try {
        await file.download({ destination: destination });

        if (sizeOf(destination).width > 600) {
            console.log('scaling image down...');
            await resizeImg(destination);
        }
        let bitmap = fs.readFileSync(destination);
        let data = new Buffer(bitmap).toString('base64');
        let response = await callAutoMLAPI(data)
        let labels = await callVisionAnnotator(data)
        Object.assign(predictions, {
            random: getRandom(0.001, 0.999),
            name: event.name,
            annotations: JSON.stringify(labels),
        });
        // Object.assign(predictions, event)
        // Get only the first prediction response
        let payload = response[0]['payload'];
        predictions[payload[0].displayName] = payload[0].classification.score;

        if (Object.keys(predictions).length === 0) {
            Object.assign(predictions, { "predictionErr": "No high confidence predictions found" });
        } else if (parseFloat(payload[0].classification.score) < 0.99) {
            Object.assign(predictions, { "predictionErr": "Confidence not high enough:" + payload[0].classification.score });
        }

        if (!predictions.predictionErr) {
            await db.collection(payload[0].displayName).add({
                image: payload[0].displayName
            })
        }
        return db.collection('images').add(predictions)
    } catch (e) {
        fs.unlinkSync(destination, (err) => {
            if (err) {
                console.log('Error deleting temp file', e)
            }
        });
    }
    return predictions
}

exports.callCustomModel = functions.storage.object().onFinalize(checkUpload);
const httpLib = require('https');
const requestLib = require('request');
const sharp = require('sharp');
// var download = (uri, filename, callback) => {
//     requestLib.head(uri, (err, res, body)=> {
//         console.log('content-type:', res.headers['content-type']);
//         console.log('content-length:', res.headers['content-length']);

//         request(uri).pipe(response);
//     });
// };

exports.mooieman = functions.https.onRequest(async (request, response) => {
    // Create a storage reference from our storage service
    // Create a reference under which you want to list
    let number = parseInt(Object.values(request.params).join('/').split('/').join(''))
    if (isNaN(number)) {
        number = getRandomPaddedInt(1, 3000)
    }
    const prefix = 'mooieman' + String(number).padStart(4, '0')
    const [files] = await bucket.getFiles({ maxResusult: 1, prefix: prefix })
    if (files.length === 0) {
        return response.status(404).json('Image Not Found')
    }
    const url = "https://firebasestorage.googleapis.com/v0/b/mooie-man.appspot.com/o/" + files[0].name + "?alt=media"

    requestLib.head(url, (err, res, body) => {
        if (err) {
            return response.status(404).json(err)
        }
        response.setHeader('Content-Type', res.headers['content-type']);
        requestLib(url).pipe(response);
    });
});

exports.fraaievrouw = functions.https.onRequest(async (request, response) => {
    // Create a storage reference from our storage service
    // Create a reference under which you want to list
    const [files] = await bucket.getFiles({ maxResusult: 1, prefix: 'fraaievrouw' + getRandomPaddedInt(1, 400) })
    response.send("https://firebasestorage.googleapis.com/v0/b/mooie-man.appspot.com/o/" + files[0].name + "?alt=media");
});

exports.mooiemanCount = functions.https.onRequest(async (request, response) => {
    corsHandler(request, response, () => { })
    let count = 3726;
    const stats = await db.collection('stats').doc('mooieman').get();
    const data = stats.data()
    if (data.lastUpdated.toDate() < new Date(Date.now() - 86400000)) { // yesterday
        const [files] = await bucket.getFiles({ prefix: 'mooieman' })
        db.collection('stats').doc('mooieman').set({ count: files.length, lastUpdated: admin.firestore.Timestamp.now() })
        console.log('Refreshed mooieman count')
        count = files.length;
    } else {
        count = data.count;
    }
    response.json(String(count));
});

exports.fraaievrouwCount = functions.https.onRequest(async (request, response) => {

    // Create a reference under which you want to list
    const files = await bucket.getFiles({ prefix: 'fraaievrouw' }).then((data) => {
        return data[0].name
    });
    response.send(String(files.length));
});