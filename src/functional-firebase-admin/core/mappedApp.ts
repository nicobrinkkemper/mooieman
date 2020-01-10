import * as app from './admin/app'
import Storage from './storage'
import Firestore from './firestore'
import { pipe, applySpec } from 'ramda'
import admin = require('firebase-admin')
export type App = { firestore: () => Firestore, storage: () => Storage } & app.MappedApp // from now on we have a function called File
export type AppFn = (app: admin.app.App) => App
export const App: AppFn = pipe(
    applySpec(app),
    (spec) => ({
        ...spec,
        storage: pipe(spec.storage, Storage),
        firestore: pipe(spec.firestore, Firestore),
    })
)