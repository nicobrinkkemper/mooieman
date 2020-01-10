import { Timestamp } from "@google-cloud/firestore"
import { WriteResult, DocumentSnapshot, Firestore, FieldValue } from '@google-cloud/firestore';
import { applySpec, curry} from 'ramda';

type setStats = (db:Firestore, collection:'stats', type:string, data:object) => Promise<WriteResult>
type getStats = (db:Firestore, collection:'stats', type:string) => Promise<DocumentSnapshot>

export const setStats: setStats = (db, collection, type, data) => db
.collection(collection)
.doc(type)
.set(
    {
        ...data,
        lastUpdated: Timestamp.now()
    },
    { merge: true }
)
    
export const getStats:getStats = (db, collection, type) => db
    .collection(collection)
    .doc(type)
    .get()