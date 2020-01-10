import { File as BucketFile, Bucket as StorageBucket, FileOptions, CreateReadStreamOptions } from 'firebase-admin/node_modules/@google-cloud/storage';
import { storage as firebaseStorage } from "firebase-admin";
import FirebaseStorage = firebaseStorage.Storage;
import { Readable } from "stream";
import { omit } from 'ramda';

export type File = Omit<BucketFile, 'name'> & ((options?: CreateReadStreamOptions) => Readable)
export type FileFn = (BucketFile: BucketFile) => File
/** a function called File leading to createReadStream with all properties of BucketFile  */
export const File: FileFn = (BucketFile) => {
    console.log('BucketFile',Object.keys(BucketFile))
    return Object.assign(
        (options?: CreateReadStreamOptions) => BucketFile.createReadStream(options),
        omit(['name'], BucketFile),
        {exists:()=>BucketFile.exists()}
    )
}

export type Bucket = Omit<StorageBucket, 'name'> & ((name: string, options?: FileOptions) => File)
export type BucketFn = (StorageBucket: StorageBucket) => Bucket
/** a function called Bucket leading to File with all properties of StorageBucket  */
export const Bucket = (StorageBucket: StorageBucket) => Object.assign(
    (name: string, options?: FileOptions) => File(StorageBucket.file(name, options)),
    omit(['name'], StorageBucket)
)

export type Storage = FirebaseStorage & ((name?: string) => Bucket)
export type StorageFn = (FirebaseStorage: FirebaseStorage) => Storage
/** a function called Storage leading to Bucket with all properties of FirebaseStorage  */
export const Storage: StorageFn = (FirebaseStorage: FirebaseStorage) => Object.assign(
    (name?: string) => Bucket(FirebaseStorage.bucket(name)),
    FirebaseStorage
)
export default Storage;