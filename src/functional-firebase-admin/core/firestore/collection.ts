import CollectionReference = FirebaseFirestore.CollectionReference
import FieldPath = FirebaseFirestore.FieldPath
import DocumentData = FirebaseFirestore.DocumentData
import WhereFilterOp = FirebaseFirestore.WhereFilterOp
import QuerySnapshot = FirebaseFirestore.QuerySnapshot
import OrderByDirection = FirebaseFirestore.OrderByDirection

export interface MappedCollectionReference extends CollectionReference {
    // no extensions yet
}
export type ofCollection<X extends keyof CollectionReference> = (collection: CollectionReference) => CollectionReference[X]
export const doc:ofCollection<'doc'> = (collection: CollectionReference) => (documentPath?: string) => {
    if (documentPath)
        return collection.doc(documentPath)
    return collection.doc();
}
export const add:ofCollection<'add'> = (collection) => (data: DocumentData) => collection.add(data); // we force a string for documentPath
export const where:ofCollection<'where'> = (collection) => (fieldPath: string|FieldPath, opStr: WhereFilterOp, value: any) => collection.where(fieldPath, opStr, value);
export const select:ofCollection<'select'> = (collection) => (...field: (string | FieldPath)[]) => collection.select(...field);
export const offset:ofCollection<'offset'> = (collection) => (offset: number) => collection.offset(offset);
export const limit:ofCollection<'limit'> = (collection) => (limit: number) => collection.limit(limit);
export const startAt:ofCollection<'startAt'> = (collection) => (...fieldValues: any[]) => collection.startAt(...fieldValues);
export const startAfter:ofCollection<'startAfter'> = (collection) => (...fieldValues: any[]) => collection.startAfter(...fieldValues);
export const endAt:ofCollection<'endAt'> = (collection) => (...fieldValues: any[]) => collection.endAt(...fieldValues);
export const endBefore:ofCollection<'endBefore'> = (collection) => (...fieldValues: any[]) => collection.endBefore(...fieldValues);
export const onSnapshot:ofCollection<'onSnapshot'> = (collection) => (onNext: (snapshot: QuerySnapshot) => void, onError?: (error: Error) => void) => collection.onSnapshot(onNext, onError);
export const isEqual:ofCollection<'isEqual'> = (collection) => (other: CollectionReference) => collection.isEqual(other);
export const orderBy:ofCollection<'orderBy'> = (collection) => (fieldPath: string|FieldPath, directionStr?: OrderByDirection) => collection.orderBy(fieldPath, directionStr);
export const stream:ofCollection<'stream'> = (collection) => () => collection.stream();
export const get:ofCollection<'get'> = (collection) => () => collection.get();
export const listDocuments:ofCollection<'listDocuments'> = (collection) => () => collection.listDocuments();
export const id:ofCollection<'id'> = (collection) => collection.id
export const parent:ofCollection<'parent'> = (collection) => collection.parent
export const path:ofCollection<'path'> = (collection) => collection.path
export const firestore:ofCollection<'firestore'> = (collection) => collection.firestore
export default doc;