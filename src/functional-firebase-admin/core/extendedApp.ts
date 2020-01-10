import Firestore from './firestore'
import Storage from './storage'
import admin = require('firebase-admin')
import {omit} from 'ramda';

export type App = (() => Firestore) & {firestore:()=>Firestore,storage:()=>Storage} & Omit<admin.app.App,'name'>
export type AppFn = (FirebaseApp: admin.app.App) => App
/**
 * Returns functions of firebase.app that can either be chained by key reference or called directly
 * The difference between this one and mappedApp is that this works without mapping all the functions of firebase admin
 * to a actual function but instead uses the original object, making it more future proof but less deterministic.
 */
const App: AppFn = (FirebaseApp) => Object.assign(
    () => Firestore(FirebaseApp.firestore()),
    omit(['name'],FirebaseApp),
    {
        firestore: () => Firestore(FirebaseApp.firestore()),
        storage: () => Storage(FirebaseApp.storage())
    }
)

export default App;