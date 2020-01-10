
import { pipe } from 'ramda';
import { DocumentChange, QuerySnapshot } from '@google-cloud/firestore';

type onSnapshot = (ref: FirebaseFirestore.CollectionReference, fn: (change: QuerySnapshot) => void) => () => void
type onDocChanges = (ref: FirebaseFirestore.CollectionReference, fn: (change: DocumentChange[]) => void) => () => void
type onDocEachChange = (ref: FirebaseFirestore.CollectionReference, fn: (value: DocumentChange, index: number, array: DocumentChange[]) => any | void) => void
type docChanges = (ref: FirebaseFirestore.QuerySnapshot) => DocumentChange[]

const docChanges: docChanges = (snapshot) => snapshot.docChanges()
/* OBSERVERS */
const onSnapshot: onSnapshot = (ref, fn) => ref.onSnapshot(fn)
const onDocChanges: onDocChanges = (ref, fn) => onSnapshot(ref, pipe(docChanges, fn));
const onEachDocChange: onDocEachChange = (ref, fn) => onDocChanges(ref, change=>change.forEach(fn))