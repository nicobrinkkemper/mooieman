
import * as file from "./file"
import * as bucket from "./bucket"
import * as storage from "./storage"
import { applySpec, pipe } from 'ramda';
import attachToDefault from "../attachToDefault";
import { File as BucketFile, Bucket as StorageBucket, FileOptions, CreateReadStreamOptions } from 'firebase-admin/node_modules/@google-cloud/storage';
import { Readable } from "stream";
import {storage as firebaseStorage} from "firebase-admin";
import FirebaseStorage = firebaseStorage.Storage;

export type File = file.MappedFile & ((options?: CreateReadStreamOptions) => Readable) // from now on we have a function called File
export type Bucket = bucket.MappedBucket & ((name: string, options?: FileOptions) => File) // from now on we have a function called Bucket leading to File 
export type Storage = storage.MappedStorage & ((name?:string) => Bucket) // from now on we have a function called Storage leading to Bucket 
export {file,bucket,storage};
 
export const File: (s:BucketFile)=>File = pipe(
    applySpec(file),
    attachToDefault,
);
export const Bucket: (s:StorageBucket)=>Bucket = pipe(
    applySpec(bucket),
    ({name,...spec}) => ({
        ...spec,
        default: pipe(spec.default, File)
    }),
    attachToDefault
);
export const Storage: (s:FirebaseStorage)=>Storage = pipe(
    applySpec(storage),
    (spec) => ({
        ...spec,
        default: pipe(spec.default, Bucket)
    }),
    attachToDefault
);

export default Storage