import {
    ExistsOptions, ExistsCallback, CreateOptions, CreateCallback, CreateResponse, DeleteOptions, GetResponse, GetConfig,
    GetMetadataOptions, MetadataResponse, ServiceObject, 
} from '@google-cloud/common/build/src/service-object';
import {
    File,Bucket
} from 'firebase-admin/node_modules/@google-cloud/storage';
import {
    DecorateRequestOptions, BodyResponseCallback, MetadataCallback, Metadata, ResponseBody, DeleteCallback,
    InstanceResponseCallback
} from '@google-cloud/common';
import * as r from 'teeny-request'
export function _create<T extends ServiceObject>(serviceObject: T): (callback: CreateCallback<T>) => void;
export function _create<T extends ServiceObject>(serviceObject: T): (options: CreateOptions, callback: CreateCallback<T>) => void
export function _create<T extends ServiceObject>(serviceObject: T): (options?: CreateOptions) => Promise<CreateResponse<T>>;
export function _create<T extends ServiceObject>(serviceObject: T) {
    return (options?: CreateOptions, callback?: CreateCallback<T>) => {
        if (!options)
            return serviceObject.create();
        if (!callback)
            return serviceObject.create(options);
        return serviceObject.create(options, callback);
    }
}

export function _request<T extends ServiceObject>(serviceObject: T): (reqOpts: DecorateRequestOptions) => Promise<[ResponseBody, Metadata]>;
export function _request<T extends ServiceObject>(serviceObject: T): (reqOpts: DecorateRequestOptions, callback: BodyResponseCallback) => void
export function _request<T extends ServiceObject>(serviceObject: T) {
    return (reqOpts: DecorateRequestOptions, callback?: BodyResponseCallback) => {
        if (!callback)
            return serviceObject.request(reqOpts);
        return serviceObject.request(reqOpts, callback);
    }
}

export function _delete<T extends ServiceObject>(serviceObject: T): (options?: DeleteOptions) => Promise<[r.Response]>;
export function _delete<T extends ServiceObject>(serviceObject: T): (options: DeleteOptions, callback: DeleteCallback) => void;
export function _delete<T extends ServiceObject>(serviceObject: T): (callback: DeleteCallback) => void;
export function _delete<T extends ServiceObject>(serviceObject: T) {
    return (options: DeleteOptions, callback?: DeleteCallback) => {
        if (!callback)
            return serviceObject.delete(callback)
        return serviceObject.delete(options, callback)
    }
}

export function _exists<T extends ServiceObject>(serviceObject: T): (options?: ExistsOptions) => Promise<[boolean]>;
export function _exists<T extends ServiceObject>(serviceObject: T): (options: ExistsOptions, callback: ExistsCallback) => void;
export function _exists<T extends ServiceObject>(serviceObject: T): (callback: ExistsCallback) => void;
export function _exists<T extends ServiceObject>(serviceObject: T) {
    return (options: ExistsOptions, callback?: ExistsCallback) => {
        if (!callback)
            return serviceObject.exists(options)
        return serviceObject.exists(options, callback)
    }
}

declare type GetOrCreateOptions = GetConfig & CreateOptions;
export function _get<T extends ServiceObject>(serviceObject: T): (options?: GetOrCreateOptions) => Promise<GetResponse<T>>;
export function _get<T extends ServiceObject>(serviceObject: T): (callback: InstanceResponseCallback<T>) => void;
export function _get<T extends ServiceObject>(serviceObject: T): (options: GetOrCreateOptions, callback: InstanceResponseCallback<T>) => void;
export function _get<T extends ServiceObject>(serviceObject: T) {
    return (options: GetOrCreateOptions, callback?: InstanceResponseCallback<T>) => {
        if (!callback)
            return serviceObject.get(options)
        return serviceObject.get(options, callback)
    }
}

export function _getMetadata<T extends ServiceObject>(serviceObject: T): (options?: GetMetadataOptions) => Promise<MetadataResponse>;
export function _getMetadata<T extends ServiceObject>(serviceObject: T): (options: GetMetadataOptions, callback: MetadataCallback) => void;
export function _getMetadata<T extends ServiceObject>(serviceObject: T): (callback: MetadataCallback) => void;
export function _getMetadata<T extends ServiceObject>(serviceObject: T) {
    return (options: GetMetadataOptions, callback?: MetadataCallback) => {
        if (!callback)
            return serviceObject.getMetadata(options);
        return serviceObject.getMetadata(options, callback);
    }
}

export function _setMetadata<T extends ServiceObject>(serviceObject: T): (metadata: Metadata, options?: Metadata) => Promise<[Metadata]>;
export function _setMetadata<T extends ServiceObject>(serviceObject: T): (metadata: Metadata, callback: MetadataCallback) => void;
export function _setMetadata<T extends ServiceObject>(serviceObject: T): (metadata: Metadata, options: Metadata, callback: MetadataCallback) => void;
export function _setMetadata<T extends ServiceObject>(serviceObject: T) {
    return (metadata: Metadata, options?: Metadata, callback?: MetadataCallback) => {
        if (!options)
            return serviceObject.setMetadata(metadata)
        if (!callback)
            return serviceObject.setMetadata(metadata, options)
        return serviceObject.setMetadata(metadata, options, callback)
    }
}

export const _metadata = <T extends ServiceObject>(serviceObject: T)=>serviceObject.metadata;
export const _baseUrl = <T extends ServiceObject>(serviceObject: T)=>serviceObject.baseUrl;
export const _parent = <T extends ServiceObject>(serviceObject: T)=>serviceObject.parent;
export const _id = <T extends ServiceObject>(serviceObject: T)=>serviceObject.id;
export const _requestStream = <T extends ServiceObject>(serviceObject: T) => (reqOpts: DecorateRequestOptions) => serviceObject.requestStream(reqOpts)

export const _addListener = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol, listener: (...args: any[]) => void) => serviceObject.addListener(event, listener)
export const _on = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol, listener: (...args: any[]) => void) => serviceObject.on(event, listener)
export const _once = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol, listener: (...args: any[]) => void) => serviceObject.once(event, listener)
export const _prependListener = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol, listener: (...args: any[]) => void) => serviceObject.prependListener(event, listener)
export const _prependOnceListener = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol, listener: (...args: any[]) => void) => serviceObject.prependOnceListener(event, listener)
export const _removeListener = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol, listener: (...args: any[]) => void) => serviceObject.removeListener(event, listener)
export const _off = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol, listener: (...args: any[]) => void) => serviceObject.off(event, listener)
export const _removeAllListeners = <T extends ServiceObject>(serviceObject: T) => (event?: string | symbol) => serviceObject.removeAllListeners(event)
export const _setMaxListeners = <T extends ServiceObject>(serviceObject: T) => (n: number) => serviceObject.setMaxListeners(n)
export const _getMaxListeners = <T extends ServiceObject>(serviceObject: T) => () => serviceObject.getMaxListeners()
export const _listeners = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol) => serviceObject.listeners(event)
export const _rawListeners = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol) => serviceObject.rawListeners(event)
export const _emit = <T extends ServiceObject>(serviceObject: T) => (event: string | symbol, ...args: any[]) => serviceObject.emit(event, ...args)
export const _eventNames = <T extends ServiceObject>(serviceObject: T) => () => serviceObject.eventNames()
export const _listenerCount = <T extends ServiceObject>(serviceObject: T) => (type: string | symbol) => serviceObject.listenerCount(type)
