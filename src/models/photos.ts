import sharp = require('sharp')
import { IMAGE_VERSIONS, dev } from "~contants";
import { imageSize } from "image-size";
import {createHash, HexBase64BinaryEncoding} from 'crypto'
import automl = require('@google-cloud/automl');
import { FIREBASE_CONFIG, location } from "~contants";
import { logAscii } from "~tools/ascii";
import functionalFbAdmin from '~functional-firebase-admin/core';
import {app} from "firebase-admin";

const { firestore, storage, Image, Stats} = functionalFbAdmin(app())
const collection = firestore();
const defaultBucket = storage()();
interface File {
    destination: string
    buffer: Buffer
    fieldname: string
    file: NodeJS.ReadableStream;
    filename: string
    encoding: string
    mimetype: string
}
// taken from https://cloud.google.com/nodejs/docs/reference/automl/0.1.x/google.cloud.automl.v1beta1#.AnnotationPayload
// probably changes in the future
type AnnotationPayload = {
    translation: {
        translatedContent:{
            content:string,
            mimeType:string,
            contentUri:string,
        }
    },
    classification: {
        score: number
    },
    annotationSpecId: string,
    displayName: string
}
type PredictResponse = {
    payload:AnnotationPayload[],
    metadata: {[key:string]:any},
    preprocessedInput: any
}

const predictionClient = new automl.v1beta1.PredictionServiceClient();
const project = FIREBASE_CONFIG.projectId;
const automl_model = {
    'mooiemanOrFraaievrouw':'ICN4428727672790743256'
}
export function analysePhoto(b64img:string, type:keyof typeof automl_model): Promise<PredictResponse[]> {
    return new Promise((resolve, reject) => {
        const payload = {
            "image": {
                "imageBytes": b64img
            }
        }
        const reqBody = {
            name: predictionClient.modelPath(project, location, automl_model[type]),
            payload: payload
        }
        predictionClient.predict(reqBody)
            .then((responses:PredictResponse[]) => {
                console.log('Got a prediction from AutoML API!');
                resolve(responses);
                return responses
            })
            .catch((err:string) => {
                console.log('AutoML API Error: ', err);
                reject(err);
            });
    });
}

const sharpClone = (tobeCloned: sharp.Sharp, version: { width: number, height: number, type: string }) =>
    Object.assign(
        tobeCloned.clone().resize(
            version.width, version.height, { fit: 'inside', withoutEnlargement: true }
        ),
        version
    )

const generateImageVersions = (baseSharp: sharp.Sharp) => {
    const [maxVersion, ...smallerVersions] = IMAGE_VERSIONS
    return smallerVersions.reduce(
        ([prev, ...rest], version) => [
            sharpClone(prev, version), // and use the previous to downscale even further
            prev,
            ...rest,
        ]
        , [sharpClone(baseSharp, maxVersion)] // we start with the biggest
    )
}

export const create = async (file:File, modelType:keyof typeof automl_model = 'mooiemanOrFraaievrouw') => {
    const {buffer, filename, mimetype} = file
    const md5 = createHash('md5').update(buffer).digest("hex")
    const {width=0,height=0,type:ext='jpg'} = imageSize(buffer)
    const versions = generateImageVersions(sharp(buffer).rotate())
    const snapshot = await collection('images')(md5).get()
    if (snapshot.exists) throw (new Error(`This image has already been fromFileed: ${snapshot.get('normal')}`))
    
    const [automlResponse] = await analysePhoto((await versions[2].toBuffer()).toString('base64'), modelType) // use the 600 version to predict mooieman or fraaievrouw
    const [payload] = automlResponse.payload;
    const type = (payload.displayName === 'mooieman' || payload.displayName === 'fraaievrouw') ? payload.displayName : 'none'
    const count = await Stats(type)('count').get()
    if (dev) await logAscii((await versions[3].toBuffer()), `${payload.displayName} (${payload.classification.score})`) // use the thumb to generate a ascii for the developer
    const baseImg = {
        md5,
        originalFilePath: `${type}/${md5}.${ext}`,
        originalFileName: `${filename}`,
        originalFileMime: mimetype,
        originalWidth: width,
        originalHeight: height,
        type,
        score: payload.classification.score,
    }
    const mainUpload = Image(md5).create({
        ...baseImg,
        fileName:md5,
        filePath: `${type}/${md5}.${ext}`,
        fileMime: mimetype, // will keep as is
        upload: buffer,
        width,
        height,
        ext
    });
    await Promise.all(versions.map(
        version =>
            Image(md5).createVersion({
                filePath: `${type}/${type + String(count).padStart(4, '0')}.webp`,
                fileMime: 'image/webp', // fromFile version images as webp to save space (25 – 35%),
                width: version.width,
                height: version.height,
                upload: version.webp(),
            }))
    )
    await mainUpload;
    return 'hi'
}
export default create