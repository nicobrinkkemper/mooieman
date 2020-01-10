import {
    File, CreateReadStreamOptions, CreateWriteStreamOptions, CopyOptions, CopyResponse, CopyCallback, CreateResumableUploadOptions, CreateResumableUploadResponse
    , CreateResumableUploadCallback, DownloadOptions, DownloadResponse, DownloadCallback, GetExpirationDateCallback, GetExpirationDateResponse,
    GetSignedPolicyOptions, GetSignedPolicyResponse, GetSignedPolicyCallback, GetSignedUrlConfig, GetSignedUrlResponse, GetSignedUrlCallback, Bucket
} from 'firebase-admin/node_modules/@google-cloud/storage';
import {
    IsPublicResponse,
    IsPublicCallback,
    MakeFilePrivateOptions,
    MakeFilePrivateResponse,
    MakeFilePrivateCallback,
    MakeFilePublicResponse,
    MakeFilePublicCallback,
    MoveOptions,
    MoveResponse,
    MoveCallback, RotateEncryptionKeyOptions,
    RotateEncryptionKeyResponse,
    RotateEncryptionKeyCallback, SaveOptions,
    SaveCallback,
    SetStorageClassCallback,
    SetStorageClassResponse,
    SetStorageClassOptions,
} from 'firebase-admin/node_modules/@google-cloud/storage/build/src/file';

import { Duplexify } from '@google-cloud/common/build/src/util';
import * as serviceObject from './service-object'
export interface MappedFile extends Omit<File, 'name' | 'getSignedUrlV2' | 'getSignedUrlV4' | 'getCanonicalHeaders' | 'interceptors' | 'methods' | 'request_'> {
    // Omits some private properties
}

type ofFile<X extends keyof File> = (file: File) => File[X];
export const createWriteStream = (file: File) => (options?: CreateWriteStreamOptions) => {
    if(!options)
        return file.createWriteStream()
    return file.createWriteStream(options)
}

export const createReadStream: ofFile<'createReadStream'> = (file) => (options?: CreateReadStreamOptions) => file.createReadStream(options);
export default createReadStream;

export const request: ofFile<'request'> = serviceObject._request;
const remove: ofFile<'delete'> = serviceObject._delete;
export {remove as delete}
export const create: ofFile<'create'> = serviceObject._create; 
export const exists: ofFile<'exists'> = serviceObject._exists; 
export const get: ofFile<'get'> = serviceObject._get;
export const getMetadata: ofFile<'getMetadata'> = serviceObject._getMetadata; 
export const setMetadata: ofFile<'setMetadata'> = serviceObject._setMetadata;
export const metadata: ofFile<'metadata'> = serviceObject._metadata
export const baseUrl: ofFile<'baseUrl'> = serviceObject._baseUrl
export const id: ofFile<'id'> = serviceObject._id
export const requestStream: ofFile<'requestStream'> = serviceObject._requestStream
export const addListener: ofFile<'addListener'> = serviceObject._addListener
export const on: ofFile<'on'> = serviceObject._on
export const once: ofFile<'once'> = serviceObject._once
export const prependListener: ofFile<'prependListener'> = serviceObject._prependListener
export const prependOnceListener: ofFile<'prependOnceListener'> = serviceObject._prependOnceListener
export const removeListener: ofFile<'removeListener'> = serviceObject._removeListener
export const off: ofFile<'off'> = serviceObject._off
export const removeAllListeners: ofFile<'removeAllListeners'> = serviceObject._removeAllListeners
export const setMaxListeners: ofFile<'setMaxListeners'> = serviceObject._setMaxListeners
export const getMaxListeners: ofFile<'getMaxListeners'> = serviceObject._getMaxListeners
export const listeners: ofFile<'listeners'> = serviceObject._listeners
export const rawListeners: ofFile<'rawListeners'> = serviceObject._rawListeners
export const emit: ofFile<'emit'> = serviceObject._emit
export const eventNames: ofFile<'eventNames'> = serviceObject._eventNames
export const listenerCount: ofFile<'listenerCount'> = serviceObject._listenerCount
export const parent: ofFile<'parent'> = (serviceObject: File)=>serviceObject.parent


function _copy<DESTINATION extends string | Bucket | File, OPTIONS extends CopyOptions>(file: File): (destination: DESTINATION, options?: OPTIONS) => Promise<CopyResponse>;
function _copy<DESTINATION extends string | Bucket | File, CALLBACK extends CopyCallback>(file: File): (destination: DESTINATION, callback: CALLBACK) => void;
function _copy<DESTINATION extends string | Bucket | File>(file: File): (destination: DESTINATION, options: CopyOptions, callback: CopyCallback) => void;
function _copy(file: File) {
    return (destination: string, options?: CopyOptions, callback?: CopyCallback) => {
        if (!options)
            return file.copy(destination)
        if (!callback)
            return file.copy(destination, options)
        return file.copy(destination, options, callback)
    }
}
export const copy: ofFile<'copy'> = _copy;

function _createResumableUpload<OPTIONS extends CreateResumableUploadOptions>(file: File): (options?: OPTIONS) => Promise<CreateResumableUploadResponse>;
function _createResumableUpload<CALLBACK extends CreateResumableUploadCallback>(file: File): (callback: CALLBACK) => void;
function _createResumableUpload(file: File): (options: CreateResumableUploadOptions, callback: CreateResumableUploadCallback) => void;
function _createResumableUpload(file: File) {
    return (options?: CreateResumableUploadOptions, callback?: CreateResumableUploadCallback) => {
        if (!options)
            return file.createResumableUpload()
        if (!callback)
            return file.createResumableUpload(options)
        return file.createResumableUpload(options, callback)
    }
}
export const createResumableUpload: ofFile<'createResumableUpload'> = _createResumableUpload;

export const deleteResumableCache: ofFile<'deleteResumableCache'> = (file) => () => file.deleteResumableCache();

function _download<OPTIONS extends DownloadOptions>(file: File): (options?: OPTIONS) => Promise<DownloadResponse>;
function _download<CALLBACK extends DownloadCallback>(file: File): (callback: CALLBACK) => void;
function _download(file: File): (options: DownloadOptions, callback: DownloadCallback) => void;
function _download(file: File) {
    return (options?: DownloadOptions, callback?: DownloadCallback) => {
        if (!options)
            return file.download()
        if (!callback)
            return file.download(options)
        return file.download(options, callback)
    }
}
export const download: ofFile<'download'> = _download

export const setEncryptionKey: ofFile<'setEncryptionKey'> = (file) => (encryptionKey: string | Buffer) => {
    if (typeof encryptionKey === 'string')
        return file.setEncryptionKey(encryptionKey);
    return file.setEncryptionKey(encryptionKey);
}

function _getExpirationDate(file: File): () => Promise<GetExpirationDateResponse>;
function _getExpirationDate(file: File): (callback: GetExpirationDateCallback) => void;
function _getExpirationDate(file: File) {
    return (callback?: GetExpirationDateCallback) => {
        if (!callback)
            return file.getExpirationDate();
        return file.getExpirationDate(callback);
    }
}
export const getExpirationDate: ofFile<'getExpirationDate'> = _getExpirationDate;
function _getSignedPolicy<OPTIONS extends GetSignedPolicyOptions>(file: File): (options: OPTIONS) => Promise<GetSignedPolicyResponse>;
function _getSignedPolicy(file: File): (options: GetSignedPolicyOptions, callback: GetSignedPolicyCallback) => void;
function _getSignedPolicy<CALLBACK extends GetSignedPolicyCallback>(file: File): (callback: CALLBACK) => void;
function _getSignedPolicy(file: File) {
    return (options: GetSignedPolicyOptions, callback?: GetSignedPolicyCallback) => {
        if (!callback)
            return file.getSignedPolicy(options);
        return file.getSignedPolicy(options, callback);
    }
}
export const getSignedPolicy: ofFile<'getSignedPolicy'> = _getSignedPolicy;

function _getSignedUrl(file: File): (cfg: GetSignedUrlConfig) => Promise<GetSignedUrlResponse>;
function _getSignedUrl(file: File): (cfg: GetSignedUrlConfig, callback: GetSignedUrlCallback) => void;
function _getSignedUrl(file: File) {
    return (cfg: GetSignedUrlConfig, callback?: GetSignedUrlCallback) => {
        if (!callback)
            return file.getSignedUrl(cfg);
        return file.getSignedUrl(cfg, callback);
    }
}
export const getSignedUrl: ofFile<'getSignedUrl'> = _getSignedUrl;

function _isPublic(file: File): () => Promise<IsPublicResponse>;
function _isPublic(file: File): (callback: IsPublicCallback) => void;
function _isPublic(file: File) {
    return (callback?: IsPublicCallback) => {
        if (!callback)
            return file.isPublic();
        return file.isPublic(callback);
    }
}
export const isPublic: ofFile<'isPublic'> = _isPublic;

function _makePrivate<OPTIONS extends MakeFilePrivateOptions>(file: File): (options?: OPTIONS) => Promise<MakeFilePrivateResponse>;
function _makePrivate<CALLBACK extends MakeFilePrivateCallback>(file: File): (callback: CALLBACK) => void;
function _makePrivate(file: File): (options: MakeFilePrivateOptions, callback: MakeFilePrivateCallback) => void;
function _makePrivate(file: File) {
    return (options?: MakeFilePrivateOptions, callback?: MakeFilePrivateCallback) => {
        if (!options)
            return file.makePrivate();
        if (!callback)
            return file.makePrivate(options);
        return file.makePrivate(options, callback);
    }
}
export const makePrivate: ofFile<'makePrivate'> = _makePrivate;

function _makePublic(file: File): () => Promise<MakeFilePublicResponse>;
function _makePublic(file: File): (callback: MakeFilePublicCallback) => void;
function _makePublic(file: File) {
    return (callback?: MakeFilePublicCallback) => {
        if (!callback)
            return file.makePublic();
        return file.makePublic(callback);
    }
}
export const makePublic: ofFile<'makePublic'> = _makePublic;

function _move<OPTIONS extends MoveOptions>(file: File): (destination: string | Bucket | File, options?: OPTIONS) => Promise<MoveResponse>;
function _move<CALLBACK extends MoveCallback>(file: File): (destination: string | Bucket | File, callback: CALLBACK) => void;
function _move(file: File): (destination: string | Bucket | File, options: MoveOptions, callback: MoveCallback) => void;
function _move(file: File) {
    return (destination: string | Bucket | File, options?: MoveOptions, callback?: MoveCallback) => {
        if (!options)
            return file.move(destination);
        if (!callback)
            return file.move(destination, options);
        return file.move(destination, options, callback);
    }
}
export const move: ofFile<'move'> = _move;

function _rotateEncryptionKey<CALLBACK extends RotateEncryptionKeyCallback>(file: File): (callback: CALLBACK) => void;
function _rotateEncryptionKey<OPTIONS extends RotateEncryptionKeyOptions>(file: File): (options?: OPTIONS) => Promise<RotateEncryptionKeyResponse>;
function _rotateEncryptionKey(file: File): (options: RotateEncryptionKeyOptions, callback: RotateEncryptionKeyCallback) => void;
function _rotateEncryptionKey(file: File) {
    return (options?: RotateEncryptionKeyOptions, callback?: RotateEncryptionKeyCallback) => {
        if (!options)
            return file.rotateEncryptionKey();
        if (!callback)
            return file.rotateEncryptionKey(options);
        return file.rotateEncryptionKey(options, callback);
    }
}
export const rotateEncryptionKey: ofFile<'rotateEncryptionKey'> = _rotateEncryptionKey;

function _save<OPTIONS extends SaveOptions>(file: File): (data: any, options?: OPTIONS) => Promise<void>;
function _save<CALLBACK extends SaveCallback>(file: File): (data: any, callback: CALLBACK) => void;
function _save(file: File): (data: any, options: SaveOptions, callback: SaveCallback) => void;
function _save(file: File) {
    return (data: any, options?: SaveOptions, callback?: SaveCallback) => {
        if (!options)
            return file.save(data);
        if (!callback)
            return file.save(data, options);
        return file.save(data, options, callback);
    }
}
export const save: ofFile<'save'> = _save;

function _setStorageClass(file: File): (storageClass: string, options?: SetStorageClassOptions | SetStorageClassCallback) => Promise<SetStorageClassResponse>;
function _setStorageClass(file: File): (storageClass: string, options: SetStorageClassOptions, callback: SetStorageClassCallback) => void;
function _setStorageClass<CALLBACK extends SaveCallback>(file: File): (storageClass: string, callback?: CALLBACK) => void;
function _setStorageClass(file: File) {
    return (storageClass: string, options?: SetStorageClassOptions, callback?: SetStorageClassCallback) => {
        if (!options)
            return file.setStorageClass(storageClass);
        if (!callback)
            return file.setStorageClass(storageClass, options);
        return file.setStorageClass(storageClass, options, callback);
    }
}
export const setStorageClass: ofFile<'setStorageClass'> = _setStorageClass;

export const setUserProject: ofFile<'setUserProject'> = (file) => (userProject: string) => file.setUserProject(userProject);
export const startResumableUpload_: ofFile<'startResumableUpload_'> = (file) => (dup: Duplexify, options: CreateResumableUploadOptions) => file.startResumableUpload_(dup, options);
export const startSimpleUpload_: ofFile<'startSimpleUpload_'> = (file) => (dup: Duplexify, options: CreateResumableUploadOptions) => file.startSimpleUpload_(dup, options);



export const acl: ofFile<'acl'> = (file) => file.acl
export const bucket: ofFile<'bucket'> = (file) => file.bucket
export const storage: ofFile<'storage'> = (file) => file.storage
export const kmsKeyName: ofFile<'kmsKeyName'> = (file) => file.kmsKeyName
export const userProject: ofFile<'userProject'> = (file) => file.userProject
export const name: ofFile<'name'> = (file) => file.name
export const generation: ofFile<'generation'> = (file) => file.generation
