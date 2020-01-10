import WriteResult = FirebaseFirestore.WriteResult
import DocumentReference = FirebaseFirestore.DocumentReference
import { FieldValue } from "@google-cloud/firestore"

export type incrementField = (field:string, n:number) => Promise<WriteResult>
export interface ExtendedDocumentReference extends DocumentReference {
    incrementField: incrementField
}

type ofExtendedDoc<X extends keyof ExtendedDocumentReference> = (doc: DocumentReference) => ExtendedDocumentReference[X]
/** A function to increment a field with firebase */
export const incrementField: ofExtendedDoc<'incrementField'> = (doc) => (field = 'count', n = 1) =>
    doc.set(
        {
            [field]: FieldValue.increment(n)
        },
        { merge: true }
    )