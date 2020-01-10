import DocumentReference = FirebaseFirestore.DocumentReference
import UpdateData = FirebaseFirestore.UpdateData
import Precondition = FirebaseFirestore.Precondition
import WriteResult = FirebaseFirestore.WriteResult
import FieldPath = FirebaseFirestore.FieldPath

type ofDoc<X extends keyof DocumentReference> = (doc: DocumentReference) => DocumentReference[X]
export interface MappedDocumentReference extends DocumentReference {
    // no changes needed
}
export const get: ofDoc<'get'> = (doc) => () => doc.get();
export const set: ofDoc<'set'> = (doc) => (data, options) => doc.set(data, options);
export const create: ofDoc<'create'> = (doc) => (data) => doc.create(data);
// data: UpdateData, precondition?: Precondition | undefined

function _update<DATA extends UpdateData, PRECONDITION extends Precondition>(doc: DocumentReference): (data: DATA, precondition?: PRECONDITION) => Promise<WriteResult>;
function _update<FIELD extends string | FieldPath, VALUE extends any>(doc: DocumentReference): (field: FIELD, value: VALUE, ...moreFieldsOrPrecondition: any[]) => Promise<WriteResult>;
function _update(doc: DocumentReference) {
    return <FIELD,VALUE>(field: FIELD, value?: VALUE, ...moreFieldsOrPrecondition: any[]) => {
        if (!value)
            return doc.update(field);
        if (!moreFieldsOrPrecondition.length)
            return doc.update(field, value);
        if (typeof field === 'string')
            return doc.update(field, value, ...moreFieldsOrPrecondition);
        return doc.update(field, value);
    }
}
export const update: ofDoc<'update'> = _update

const remove: ofDoc<'delete'> = (doc) => (precondition) => doc.delete(precondition);
export { remove as delete }; // can't write delete otherwise


export const collection: ofDoc<'collection'> = (doc) => (collectionPath) => doc.collection(collectionPath);
export const listCollections: ofDoc<'listCollections'> = (doc) => () => doc.listCollections();
export const isEqual: ofDoc<'isEqual'> = (doc) => (other) => doc.isEqual(other);
export const onSnapshot: ofDoc<'onSnapshot'> = (doc) => (onNext, onError) => doc.onSnapshot(onNext, onError);

export const id: ofDoc<'id'> = (doc) => doc.id;
export const firestore: ofDoc<'firestore'> = (doc) => doc.firestore;
export const parent: ofDoc<'parent'> = (doc) => doc.parent;
export const path: ofDoc<'path'> = (doc) => doc.path;


export default collection;