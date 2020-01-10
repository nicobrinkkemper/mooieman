import { HexBase64BinaryEncoding } from "crypto";
import automl = require('@google-cloud/automl');
import { FIREBASE_CONFIG, location } from "~contants";
const predictionClient = new automl.v1beta1.PredictionServiceClient();
const project = FIREBASE_CONFIG.projectId;
const automl_model = {
    'mooiemanOrFraaievrouw':'ICN4428727672790743256'
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
export function callAutoMLAPI(b64img:string, type:keyof typeof automl_model): Promise<PredictResponse[]> {
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