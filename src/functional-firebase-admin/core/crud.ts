import { Collection, Doc } from "./firestore"
import { Timestamp, DocumentData, UpdateData, Precondition } from "@google-cloud/firestore";
import { pipe, then } from 'ramda'

export interface crud {
    create: <DATA extends DocumentData>(optionst: DATA) => Promise<FirebaseFirestore.WriteResult>,
    update: <DATA extends UpdateData, PRECONDITION extends Precondition>(data: DATA, precondition?: PRECONDITION) => Promise<FirebaseFirestore.WriteResult>,
    read: () => Promise<DocumentData | undefined>
    delete: (precondition?: Precondition) => Promise<FirebaseFirestore.WriteResult>
    getCount: () => Promise<number>
    sub: (documentPath: string, collectionPath: string) => crud
}

export const getCount = (Stats: Collection) =>
    (Doc: Doc) => pipe(
        Stats(Doc.parent.id).get,
        then(v => Number(v.get('count'))),
    )

const addCreatedTimestamp = (data: UpdateData) => ({
    ...data,
    created: Timestamp.now()
})
export const create = (Stats: Collection) =>
    (Doc: Doc) => pipe(
        addCreatedTimestamp,
        Doc.create,
        then(async (WriteResult) => {
            await Stats(Doc.parent.id).incrementField('count', 1);
            return WriteResult;
        }),
    )

export const read = (_: Collection) =>
    (Doc: Doc) => pipe(
        Doc.get,
        then(v => v.data()),
    )

const addUpdatedimestamp = (data: UpdateData) => ({
    ...data,
    updated: Timestamp.now()
})
export const update = (_: Collection) =>
    (Doc: Doc) => pipe(
        addUpdatedimestamp,
        (data) => Doc.update(data)
    )

const remove = (Stats: Collection) =>
    (Doc: Doc) => pipe(
        Doc.delete,
        then(async (WriteResult) => {
            await Stats(Doc.parent.id).incrementField('count', -1);
            return WriteResult;
        })
    )

export { remove as delete }
const subDoc = (Doc: Doc) => (documentPath: string, collectionPath: string) => Doc(collectionPath)(documentPath)
export const newCrud = (Stats: Collection) => (Doc: Doc): crud => ({
    getCount: getCount(Stats)(Doc),
    create: create(Stats)(Doc),
    delete: remove(Stats)(Doc),
    update: update(Stats)(Doc),
    read: read(Stats)(Doc),
    sub: sub(Stats)(Doc),
})
export const sub = (Stats: Collection) =>
    (Doc: Doc) => pipe(
        subDoc(Doc),
        newCrud(Stats)
    )

export default read