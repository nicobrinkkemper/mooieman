import {storage} from "firebase-admin";
import Storage = storage.Storage;
export interface MappedStorage extends Omit<Storage,'name'> {
    // omits name
}
type ofStorage<X extends keyof Storage> = (bucket: Storage) => Storage[X];
export const app:ofStorage<'app'> = (storage: Storage) => storage.app
export const bucket:ofStorage<'bucket'> = (storage: Storage) => (name?:string) => {
    if(!name)
        return storage.bucket()  
    return storage.bucket(name)
}
export default bucket;