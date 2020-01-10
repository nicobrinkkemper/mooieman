import CollectionReference = FirebaseFirestore.CollectionReference
import DocumentReference = FirebaseFirestore.DocumentReference
import { incrementField, ExtendedDocumentReference } from './extendedDoc'
import { get } from './firestore/doc'

export type Doc = ((collectionPath: string) => Collection) & ExtendedDocumentReference
export type DocFn = (DocumentReference: DocumentReference) => Doc
/** a function called Doc leading to (sub-)Collection with all properties of DocumentReference */
export const Doc: DocFn = (DocumentReference) => Object.assign(
    (collectionPath: string) => Collection(DocumentReference.collection(collectionPath)),
    DocumentReference,
    {
        incrementField: incrementField(DocumentReference),
        get: get(DocumentReference)
    }
)

export type Collection = ((documentPath: string) => Doc) & CollectionReference
export type CollectionFn = (CollectionReference: CollectionReference) => Collection
/** a function called Collection leading to Doc with all properties of CollectionReference */
export const Collection: CollectionFn = (CollectionReference) => Object.assign(
    (documentPath: string) => Doc(CollectionReference.doc(documentPath)),
    CollectionReference
)

export type Firestore = ((collectionPath: string) => Collection) & FirebaseFirestore.Firestore
export type FirestoreFn = (FirebaseFirestore: FirebaseFirestore.Firestore) => Firestore
/** a function called Firestore leading to Collection with all properties of FirebaseFirestore */
export const Firestore: FirestoreFn = (FirebaseFirestore) => Object.assign(
    (collectionPath: string) => Collection(FirebaseFirestore.collection(collectionPath)),
    FirebaseFirestore
)
export default Firestore