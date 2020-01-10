import {
    Bucket, FileOptions, UploadOptions,
    File,
    CombineOptions,
    CombineResponse,
    CombineCallback,
    CreateChannelConfig,
    CreateChannelOptions,
    CreateChannelResponse,
    CreateChannelCallback,
    CreateNotificationOptions,
    CreateNotificationResponse,
    CreateNotificationCallback,
    DeleteFilesOptions,
    DeleteFilesCallback,
    DeleteLabelsResponse,
    DeleteLabelsCallback,
    DisableRequesterPaysResponse,
    DisableRequesterPaysCallback,
    EnableRequesterPaysResponse,
    EnableRequesterPaysCallback,
} from 'firebase-admin/node_modules/@google-cloud/storage';

import {
    LifecycleRule,
    AddLifecycleRuleOptions,
    SetBucketMetadataResponse,
    SetBucketMetadataCallback,
    EnableLoggingOptions,
    GetFilesOptions,
    GetFilesResponse,
    MakeBucketPrivateCallback,
    MakeBucketPrivateOptions,
    MakeBucketPublicOptions,
    GetFilesCallback,
    GetLabelsCallback,
    GetNotificationsOptions,
    GetNotificationsResponse,
    GetNotificationsCallback,
    BucketLockResponse,
    BucketLockCallback,
    MakeBucketPrivateResponse,
    MakeBucketPublicResponse,
    MakeBucketPublicCallback,
    GetLabelsOptions,
    GetLabelsResponse,
    SetLabelsOptions,
    SetLabelsResponse,
    SetLabelsCallback,
    SetBucketStorageClassOptions,
    SetBucketStorageClassCallback,
    Labels,
    UploadResponse,
    UploadCallback,
    MakeAllFilesPublicPrivateOptions,

} from 'firebase-admin/node_modules/@google-cloud/storage/build/src/bucket';
import * as serviceObject from './service-object'
export interface MappedBucket extends Omit<Bucket, 'name' | 'createMethod' | 'interceptors' | 'methods' | 'request_'> {
    
}

type ofBucket<X extends keyof Bucket> = (bucket: Bucket) => Bucket[X];

export const file: ofBucket<'file'> = (bucket) => (name: string, options?: FileOptions) => {
    if(!options)
        return bucket.file(name)
    return bucket.file(name, options)
}
export default file;

export const request: ofBucket<'request'> = serviceObject._request;
const remove: ofBucket<'delete'> = serviceObject._delete;
export {remove as delete}
export const create: ofBucket<'create'> = serviceObject._create; 
export const exists: ofBucket<'exists'> = serviceObject._exists; 
export const get: ofBucket<'get'> = serviceObject._get;
export const getMetadata: ofBucket<'getMetadata'> = serviceObject._getMetadata; 
export const setMetadata: ofBucket<'setMetadata'> = serviceObject._setMetadata;
export const metadata: ofBucket<'metadata'> = serviceObject._metadata
export const baseUrl: ofBucket<'baseUrl'> = serviceObject._baseUrl
export const parent: ofBucket<'parent'> = serviceObject._parent
export const id: ofBucket<'id'> = serviceObject._id
export const requestStream: ofBucket<'requestStream'> = serviceObject._requestStream
export const addListener: ofBucket<'addListener'> = serviceObject._addListener
export const on: ofBucket<'on'> = serviceObject._on
export const once: ofBucket<'once'> = serviceObject._once
export const prependListener: ofBucket<'prependListener'> = serviceObject._prependListener
export const prependOnceListener: ofBucket<'prependOnceListener'> = serviceObject._prependOnceListener
export const removeListener: ofBucket<'removeListener'> = serviceObject._removeListener
export const off: ofBucket<'off'> = serviceObject._off
export const removeAllListeners: ofBucket<'removeAllListeners'> = serviceObject._removeAllListeners
export const setMaxListeners: ofBucket<'setMaxListeners'> = serviceObject._setMaxListeners
export const getMaxListeners: ofBucket<'getMaxListeners'> = serviceObject._getMaxListeners
export const listeners: ofBucket<'listeners'> = serviceObject._listeners
export const rawListeners: ofBucket<'rawListeners'> = serviceObject._rawListeners
export const emit: ofBucket<'emit'> = serviceObject._emit
export const eventNames: ofBucket<'eventNames'> = serviceObject._eventNames
export const listenerCount: ofBucket<'listenerCount'> = serviceObject._listenerCount

export const name:ofBucket<'name'> = (bucket)=>bucket.name;
export const storage:ofBucket<'storage'> = (bucket)=>bucket.storage;
export const userProject:ofBucket<'userProject'> = (bucket)=>bucket.userProject;
export const acl:ofBucket<'acl'> = (bucket)=>bucket.acl;
export const iam:ofBucket<'iam'> = (bucket)=>bucket.iam;
export const getFilesStream:ofBucket<'getFilesStream'> = (bucket)=>bucket.getFilesStream;

function _addLifecycleRule<OPTIONS extends AddLifecycleRuleOptions>(bucket: Bucket): (rule: LifecycleRule, options?: OPTIONS) => Promise<SetBucketMetadataResponse>;
function _addLifecycleRule(bucket: Bucket): (rule: LifecycleRule, options: AddLifecycleRuleOptions, callback: SetBucketMetadataCallback) => void;
function _addLifecycleRule<CALLBACK extends SetBucketMetadataCallback>(bucket: Bucket): (rule: LifecycleRule, callback: CALLBACK) => void;
function _addLifecycleRule<OPTIONS>(bucket: Bucket) {
    return (rule: LifecycleRule, options?: OPTIONS, callback?: SetBucketMetadataCallback) => {
        if (!options)
            return bucket.addLifecycleRule(rule)
        if (!callback)
            return bucket.addLifecycleRule(rule, options)
        return bucket.addLifecycleRule(rule, options, callback)
    }
}
export const addLifecycleRule: ofBucket<'addLifecycleRule'> = _addLifecycleRule;
function _combine<OPTIONS extends CombineOptions>(bucket: Bucket): (sources: string[] | File[], destination: string | File, options?: OPTIONS) => Promise<CombineResponse>;
function _combine(bucket: Bucket): (sources: string[] | File[], destination: string | File, options: CombineOptions, callback: CombineCallback) => void;
function _combine<CALLBACK extends CombineCallback>(bucket: Bucket): (sources: string[] | File[], destination: string | File, callback: CALLBACK) => void;
function _combine<OPTIONS>(bucket: Bucket) {
    return (sources: string[] | File[], destination: string | File, options?: OPTIONS, callback?: CombineCallback) => {
        if (!options)
            return bucket.combine(sources, destination)
        if (!callback)
            return bucket.combine(sources, destination, options)
        return bucket.combine(sources, destination, options, callback)
    }
}
export const combine: ofBucket<'combine'> = _combine;
function _createChannel<OPTIONS extends CreateChannelOptions>(bucket: Bucket): (id: string, config: CreateChannelConfig, options?: OPTIONS) => Promise<CreateChannelResponse>;
function _createChannel<CALLBACK extends CreateChannelCallback>(bucket: Bucket): (id: string, config: CreateChannelConfig, callback: CALLBACK) => void;
function _createChannel(bucket: Bucket): (id: string, config: CreateChannelConfig, options: CreateChannelOptions, callback: CreateChannelCallback) => void;
function _createChannel(bucket: Bucket) {
    return (id: string, config: CreateChannelConfig, options: CreateChannelOptions, callback?: CreateChannelCallback) => {
        if (!options)
            return bucket.createChannel(id, config)
        if (!callback)
            return bucket.createChannel(id, config, options)
        return bucket.createChannel(id, config, options, callback)
    }
}
export const createChannel: ofBucket<'createChannel'> = _createChannel;
function _createNotification<OPTIONS extends CreateNotificationOptions>(bucket: Bucket): (topic: string, options?: OPTIONS) => Promise<CreateNotificationResponse>;
function _createNotification(bucket: Bucket): (topic: string, options: CreateNotificationOptions, callback: CreateNotificationCallback) => void;
function _createNotification<CALLBACK extends CreateNotificationCallback>(bucket: Bucket): (topic: string, callback: CALLBACK) => void;
function _createNotification(bucket: Bucket) {
    return (topic: string, options: CreateNotificationOptions, callback: CreateNotificationCallback) => {
        if (!options)
            return bucket.createNotification(topic)
        if (!callback)
            return bucket.createNotification(topic, options)
        return bucket.createNotification(topic, options, callback)
    }
}
export const createNotification: ofBucket<'createNotification'> = _createNotification;

function _deleteFiles<OPTIONS extends DeleteFilesOptions>(bucket: Bucket): (query?: OPTIONS) => Promise<void>;
function _deleteFiles<CALLBACK extends DeleteFilesCallback>(bucket: Bucket): (callback: CALLBACK) => void;
function _deleteFiles(bucket: Bucket): (query: DeleteFilesOptions, callback: DeleteFilesCallback) => void;
function _deleteFiles(bucket: Bucket) {
    return (query: DeleteFilesOptions, callback?: DeleteFilesCallback) => {
        if (!callback)
            return bucket.deleteFiles(query)
        return bucket.deleteFiles(query, callback)
    }
}
export const deleteFiles: ofBucket<'deleteFiles'> = _deleteFiles;
function _deleteLabels<LABELS extends string | string[]>(bucket: Bucket): (labels?: LABELS) => Promise<DeleteLabelsResponse>;
function _deleteLabels<CALLBACK extends DeleteLabelsCallback>(bucket: Bucket): (callback: CALLBACK) => void;
function _deleteLabels(bucket: Bucket): (labels: string | string[], callback: DeleteLabelsCallback) => void;
function _deleteLabels(bucket: Bucket) {
    return (labels: string | string[], callback: DeleteLabelsCallback) => {
        if (!callback)
            return bucket.deleteLabels(labels)
        return bucket.deleteLabels(labels, callback)
    }
}
export const deleteLabels: ofBucket<'deleteLabels'> = _deleteLabels;
function _disableRequesterPays(bucket: Bucket): () => Promise<DisableRequesterPaysResponse>;
function _disableRequesterPays<CALLBACK extends DisableRequesterPaysCallback>(bucket: Bucket): (callback: CALLBACK) => void;
function _disableRequesterPays(bucket: Bucket) {
    return (callback?: DisableRequesterPaysCallback) => {
        if (!callback)
            return bucket.disableRequesterPays()
        return bucket.disableRequesterPays(callback)
    }
}
export const disableRequesterPays: ofBucket<'disableRequesterPays'> = _disableRequesterPays;
function _enableLogging(bucket: Bucket): (config: EnableLoggingOptions) => Promise<SetBucketMetadataResponse>;
function _enableLogging(bucket: Bucket): (config: EnableLoggingOptions, callback: SetBucketMetadataCallback) => void;
function _enableLogging(bucket: Bucket) {
    return (config: EnableLoggingOptions, callback: SetBucketMetadataCallback) => {
        if (!callback)
            return bucket.enableLogging(config)
        return bucket.enableLogging(config, callback)
    }
}
export const enableLogging: ofBucket<'enableLogging'> = _enableLogging;
function _enableRequesterPays(bucket: Bucket): () => Promise<EnableRequesterPaysResponse>;
function _enableRequesterPays(bucket: Bucket): (callback: EnableRequesterPaysCallback) => void;
function _enableRequesterPays(bucket: Bucket) {
    return (callback?: EnableRequesterPaysCallback) => {
        if (!callback)
            return bucket.enableRequesterPays()
        return bucket.enableRequesterPays(callback)
    }
}
export const enableRequesterPays: ofBucket<'enableRequesterPays'> = _enableRequesterPays;

function _getFiles<OPTIONS extends GetFilesOptions>(bucket: Bucket): (query?: OPTIONS) => Promise<GetFilesResponse>;
function _getFiles(bucket: Bucket): (query: GetFilesOptions, callback: GetFilesCallback) => void;
function _getFiles<CALLBACK extends GetFilesCallback>(bucket: Bucket): (callback: CALLBACK) => void;
function _getFiles(bucket: Bucket) {
    return (query: GetFilesOptions, callback: GetFilesCallback) => {
        if (!callback)
            return bucket.getFiles(query)
        return bucket.getFiles(query, callback)
    }
}
export const getFiles: ofBucket<'getFiles'> = _getFiles;
function _getLabels<OPTIONS extends GetLabelsOptions>(bucket: Bucket): (options: OPTIONS) => Promise<GetLabelsResponse>;
function _getLabels<CALLBACK extends GetLabelsCallback>(bucket: Bucket): (callback: CALLBACK) => void;
function _getLabels(bucket: Bucket): (options: GetLabelsOptions, callback: GetLabelsCallback) => void;
function _getLabels(bucket: Bucket) {
    return (options: GetLabelsOptions, callback?: GetLabelsCallback) => {
        if (!callback)
            return bucket.getLabels(options)
        bucket.getLabels(options, callback);
    }
}
export const getLabels: ofBucket<'getLabels'> = _getLabels;

function _getNotifications<OPTIONS extends GetNotificationsOptions>(bucket: Bucket): (options?: OPTIONS) => Promise<GetNotificationsResponse>;
function _getNotifications<CALLBACK extends GetNotificationsCallback>(bucket: Bucket): (callback: CALLBACK) => void;
function _getNotifications(bucket: Bucket): (options: GetNotificationsOptions, callback: GetNotificationsCallback) => void;
function _getNotifications(bucket: Bucket) {
    return (options?: GetNotificationsOptions, callback?: GetNotificationsCallback) => {
        if (!options)
            return bucket.getNotifications()
        if (!callback)
            return bucket.getNotifications(options)
        bucket.getNotifications(options, callback);
    }
}
export const getNotifications: ofBucket<'getNotifications'> = _getNotifications;

function _lock(bucket: Bucket): (metageneration: number | string) => Promise<BucketLockResponse>;
function _lock(bucket: Bucket): (metageneration: number | string, callback: BucketLockCallback) => void;
function _lock(bucket: Bucket) {
    return (metageneration: number | string, callback?: BucketLockCallback) => {
        if (!callback)
            return bucket.lock(metageneration)
        bucket.lock(metageneration, callback);
    }
}
export const lock: ofBucket<'lock'> = _lock;
function _makePrivate<OPTIONS extends MakeBucketPrivateOptions>(bucket: Bucket): (options?: OPTIONS) => Promise<MakeBucketPrivateResponse>;
function _makePrivate<CALLBACK extends MakeBucketPrivateCallback>(bucket: Bucket): (callback: CALLBACK) => void;
function _makePrivate(bucket: Bucket): (options: MakeBucketPrivateOptions, callback: MakeBucketPrivateCallback) => void;
function _makePrivate(bucket: Bucket) {
    return (options: MakeBucketPrivateOptions, callback?: MakeBucketPrivateCallback) => {
        if (!options)
            return bucket.makePrivate()
        if (!callback)
            return bucket.makePrivate(options)
        bucket.makePrivate(options, callback);
    }
}
export const makePrivate: ofBucket<'makePrivate'> = _makePrivate;
function _makePublic<OPTIONS extends MakeBucketPublicOptions>(bucket: Bucket): (options?: OPTIONS) => Promise<MakeBucketPublicResponse>;
function _makePublic<CALLBACK extends MakeBucketPublicCallback>(bucket: Bucket): (callback: CALLBACK) => void;
function _makePublic(bucket: Bucket): (options: MakeBucketPublicOptions, callback: MakeBucketPublicCallback) => void;
function _makePublic(bucket: Bucket) {
    return (options: MakeBucketPublicOptions, callback?: MakeBucketPublicCallback) => {
        if (!options)
            return bucket.makePublic()
        if (!callback)
            return bucket.makePublic(options)
        bucket.makePublic(options, callback);
    }
}
export const makePublic: ofBucket<'makePublic'> = _makePublic;

export const notification: ofBucket<'notification'> = (bucket) => (id: string) => bucket.notification(id);
function _removeRetentionPeriod(bucket: Bucket): () => Promise<SetBucketMetadataResponse>;
function _removeRetentionPeriod(bucket: Bucket): (callback: SetBucketMetadataCallback) => void;
function _removeRetentionPeriod(bucket: Bucket) {
    return (callback: SetBucketMetadataCallback) => {
        if (!callback)
            return bucket.removeRetentionPeriod();
        return bucket.removeRetentionPeriod(callback);
    }
}
export const removeRetentionPeriod: ofBucket<'removeRetentionPeriod'> = _removeRetentionPeriod;


function _setLabels<OPTIONS extends SetLabelsOptions>(bucket: Bucket): (labels: Labels, options?: OPTIONS) => Promise<SetLabelsResponse>;
function _setLabels<CALLBACK extends SetLabelsCallback>(bucket: Bucket): (labels: Labels, callback: CALLBACK) => void;
function _setLabels(bucket: Bucket): (labels: Labels, options: SetLabelsOptions, callback: SetLabelsCallback) => void;
function _setLabels(bucket: Bucket) {
    return (labels: Labels, options?: SetLabelsOptions, callback?: SetLabelsCallback) => {
        if (!options)
            return bucket.setLabels(labels);
        if (!callback)
            return bucket.setLabels(labels, options);
        return bucket.setLabels(labels, options, callback);
    }
}
export const setLabels: ofBucket<'setLabels'> = _setLabels;
function _setRetentionPeriod(bucket: Bucket): (duration: number) => Promise<SetBucketMetadataResponse>;
function _setRetentionPeriod(bucket: Bucket): (duration: number, callback: SetBucketMetadataCallback) => void;
function _setRetentionPeriod(bucket: Bucket) {
    return (duration: number, callback?: SetBucketMetadataCallback) => {
        if (!callback)
            return bucket.setRetentionPeriod(duration);
        bucket.setRetentionPeriod(duration, callback);
    }
}
export const setRetentionPeriod: ofBucket<'setRetentionPeriod'> = _setRetentionPeriod;
function _setStorageClass<OPTIONS extends SetBucketStorageClassOptions>(bucket: Bucket): (storageClass: string, options?: OPTIONS) => Promise<SetBucketMetadataResponse>;
function _setStorageClass<CALLBACK extends SetBucketStorageClassCallback>(bucket: Bucket): (storageClass: string, callback: CALLBACK) => void;
function _setStorageClass(bucket: Bucket): (storageClass: string, options: SetBucketStorageClassOptions, callback: SetBucketStorageClassCallback) => void;
function _setStorageClass(bucket: Bucket) {
    return (storageClass: string, options?: SetBucketStorageClassOptions, callback?: SetBucketStorageClassCallback) => {
        if (!options)
            return bucket.setStorageClass(storageClass);
        if (!callback)
            return bucket.setStorageClass(storageClass, options);
        return bucket.setStorageClass(storageClass, options, callback);
    }
}
export const setStorageClass: ofBucket<'setStorageClass'> = _setStorageClass;

export const setUserProject: ofBucket<'setUserProject'> = (bucket) => (userProject: string) => bucket.setUserProject(userProject);
function _upload<OPTIONS extends UploadOptions>(bucket: Bucket): (pathString: string, options?: OPTIONS) => Promise<UploadResponse>;
function _upload(bucket: Bucket): (pathString: string, options: UploadOptions, callback: UploadCallback) => void;
function _upload<CALLBACK extends UploadCallback>(bucket: Bucket): (pathString: string, callback: CALLBACK) => void;
function _upload(bucket: Bucket) {
    return (pathString: string, options: UploadOptions, callback?: UploadCallback) => {
        if (!options)
            return bucket.upload(pathString);
        if (!callback)
            return bucket.upload(pathString, options);
        return bucket.upload(pathString, options, callback);
    }
}
export const upload: ofBucket<'upload'> = _upload

declare type MakeAllFilesPublicPrivateResponse = [File[]];
function _makeAllFilesPublicPrivate_<OPTIONS extends MakeAllFilesPublicPrivateOptions>(bucket: Bucket): (options?: OPTIONS) => Promise<MakeAllFilesPublicPrivateResponse>;
function _makeAllFilesPublicPrivate_<CALLBACK extends MakeAllFilesPublicPrivateOptions>(bucket: Bucket): (callback: CALLBACK) => void;
function _makeAllFilesPublicPrivate_(bucket: Bucket) {
    return (options?: MakeAllFilesPublicPrivateOptions) => {
        return bucket.makeAllFilesPublicPrivate_(options)
    }
}
export const makeAllFilesPublicPrivate_: ofBucket<'makeAllFilesPublicPrivate_'> = _makeAllFilesPublicPrivate_


export const getId: ofBucket<'getId'> = (bucket) => () => bucket.getId();

