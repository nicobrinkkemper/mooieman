import { https as httpsFunction, storage as storageFunction } from 'firebase-functions';
import gqlServer from '~graphql/server';
import functionalFbAdmin from '~functional-firebase-admin/core';
import admin = require("firebase-admin");

import express = require('express')
import HTTPError from '~tools/errors';
import { getRandomInt } from '~tools/numbers';
import { FIREBASE_CONFIG, dev } from '~contants';
import { createUploadBusboy } from '~tools/uploadBusboy';
import { Request } from 'express-serve-static-core';
import { logAscii } from '~tools/ascii';
import { create } from '~models/photos';

// import mime from 'mime-types'
var app = express()
admin.initializeApp(FIREBASE_CONFIG)

const { firestore, storage } = functionalFbAdmin(admin.app())
const collection = firestore();
const { Image, Stats } = functionalFbAdmin(admin.app())
const defaultBucket = storage()();

app.get('/count/:type', async (request, response) => {
    try {
        const { params: { type } } = request;
        console.log('type', type)
        const snapshot = await Stats(type).get()
        if (!snapshot.exists) throw (new HTTPError(404, `${type} stats not found`))
        const data = await snapshot.data();
        if (!data || !data.count) throw (new HTTPError(404, `${type} count not found`))
        response.json(data.count)
    } catch (e) {
        if (dev) console.log(`error ${Object.values(request.params).join('/')}`)
        if (dev) console.trace(e)
        if (typeof e.statusCode === 'number') response.status(e.statusCode).json(e.message)
    }
    return response.send()
})

interface MooiemanOrFraaievrouwRequest extends Request { params: { type: 'fraaievrouw' | 'mooieman', id: string } };
app.get('/:type(mooieman|fraaievrouw)/:id(\\d+)?', async (
    request: MooiemanOrFraaievrouwRequest,
    response
) => {
    let { params: { type, id } } = request;
    const imgResponse: Uint8Array[] = [];
    try {
        if (!id || isNaN(parseInt(id))) {
            const snapshot = await Stats(type).get()
            if (!snapshot.exists) throw (new HTTPError(404, `${type}/${id} not found`))
            const data = snapshot.data();
            if (!data || !data.count) throw (new HTTPError(404, `${type}/${id} count not found`))
            id = String(getRandomInt(1, data.count))
        }
        const createReadStream = await defaultBucket(`${type}/${type}${id.padStart(4, '0')}.jpg`)
        console.log(Object.keys(createReadStream))
        if (!createReadStream.exists()) throw (new HTTPError(404, `${type} image not found`))
        const readStream = createReadStream();
        if (!readStream) throw (new HTTPError(404, `${type} stream not found`))
        if (dev) readStream.on('data', (data) => imgResponse.push(data))
        await new Promise(
            (resolve, reject) => readStream
                .on('response', (resp) => response.setHeader('Content-Type', resp.headers['content-type']))
                .on('error', reject)
                .on('end', resolve)
                .pipe(response)
        );
        if (dev) await logAscii(Buffer.concat(imgResponse), `Downloaded ${type}/${id}`)
    } catch (e) {
        if (dev) console.log(`error ${Object.values(request.params).join('/')}`)
        if (dev) console.trace(e)
        if (typeof e.statusCode === 'number') response.status(e.statusCode).json(e.message)
    }
    return response.send()
})


app.post('/upload', async (request, response) => {
    try {
      
        const uploadBusboy = createUploadBusboy(request,{
            onFile: {
                fileWrites: ()=>({
                    dddddddddddddd:'jim'
                })
            }
        })
        await uploadBusboy((c)=>{
            console.log(c)
        });
        console.log('done')
        response.json(Object.values(uploadBusboy.files()).flat().map(({file,...other})=>other))
    } catch (e) {
        if (dev) console.log(`error ${Object.values(request.params).join('/')}`, e.message)
        if (dev) console.trace(e)
        if (typeof e.statusCode === 'number') response.status(e.statusCode).json(e.message)
    }
    return response.send()
})


// http://localhost:5001/mooie-man/us-central/graphql/
// https://us-central1-mooie-man.cloudfunctions.net/graphql/
export const graphql = httpsFunction.onRequest(gqlServer({

}));
// http://localhost:5001/mooie-man/us-central/count/
// https://us-central1-mooie-man.cloudfunctions.net/count/
export const count = httpsFunction.onRequest(app)
// http://localhost:5001/mooie-man/us-central/mooieman/
// https://us-central1-mooie-man.cloudfunctions.net/mooieman/
export const mooieman = httpsFunction.onRequest(app)
// http://localhost:5001/mooie-man/us-central/fraaievrouw/
// https://us-central1-mooie-man.cloudfunctions.net/fraaievrouw/
export const fraaievrouw = httpsFunction.onRequest(app)
// http://localhost:5001/mooie-man/us-central/manualUpload/
// https://us-central1-mooie-man.cloudfunctions.net/manualUpload/
export const upload = httpsFunction.onRequest(app)
export const uploadFinalize = storageFunction.object().onFinalize((event) => {
    console.log('uploadFinalize')
});