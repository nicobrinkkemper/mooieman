
import Settings = FirebaseFirestore.Settings;
import Firestore = FirebaseFirestore.Firestore;
import DocumentReference = FirebaseFirestore.DocumentReference;
import ReadOptions = FirebaseFirestore.ReadOptions;
import Transaction = FirebaseFirestore.Transaction;
export interface MappedFirestore extends Firestore {
    // no changes needed
}

export const collection = (firestore:Firestore)=>(collectionPath:string)=>firestore.collection(collectionPath)
export const settings = (firestore:Firestore)=>(settings: Settings)=>firestore.settings(settings);
export const doc = (firestore:Firestore)=>(documentPath: string)=>firestore.doc(documentPath);
export const collectionGroup = (firestore:Firestore)=>(collectionId: string)=>firestore.collectionGroup(collectionId);
export const getAll = (firestore:Firestore)=>(...documentRefsOrReadOptions: Array<DocumentReference|ReadOptions>)=>firestore.getAll(...documentRefsOrReadOptions);
export const listCollections = (firestore:Firestore)=>()=>firestore.listCollections();
export const runTransaction = (firestore:Firestore)=><T>(updateFunction: (transaction: Transaction) => Promise<T>, transactionOptions?:{maxAttempts?: number}) => firestore.runTransaction(updateFunction, transactionOptions)
export const batch = (firestore:Firestore)=>()=>firestore.batch();

export default collection;