import * as doc from "./doc"
import * as collection from "./collection"
import * as snapshot from "./snapshot"
import * as firestore from "./firestore"
import { applySpec, pipe } from 'ramda';
import attachToDefault from "../attachToDefault";

import CollectionReference = FirebaseFirestore.CollectionReference
import DocumentData = FirebaseFirestore.DocumentData
import DocumentReference = FirebaseFirestore.DocumentReference
import DocumentSnapshot = FirebaseFirestore.DocumentSnapshot

export type Snapshot = snapshot.MappedDocumentSnapshot & (() => DocumentData | undefined)
export type Doc = doc.MappedDocumentReference & ((collectionPath: string) => Collection)
export type Collection = collection.MappedCollectionReference & ((documentPath: string) => Doc)
export type Firestore = firestore.MappedFirestore & ((collectionPath: string) => Collection)

export {doc,collection,snapshot,firestore};

export const Snapshot: (s:DocumentSnapshot)=>Snapshot = pipe(
    applySpec(snapshot),
    attachToDefault
);
export const Doc: (d:DocumentReference)=>Doc = pipe(
    applySpec(doc),
    (spec) => ({
        ...spec,
        default: pipe(spec.default, Collection)
    }),
    attachToDefault
);
export const Collection: (d:CollectionReference)=>Collection = pipe(
    applySpec(collection),
    (spec) => ({
        ...spec,
        default: pipe(spec.default, Doc)
    }),
    attachToDefault
);
export const Firestore: (d:FirebaseFirestore.Firestore)=>Firestore = pipe(
    applySpec(firestore),
    (spec) => ({
        ...spec,
        default: pipe(spec.default, Collection)
    }),
    attachToDefault
);

export default Firestore