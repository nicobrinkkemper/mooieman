import DocumentSnapshot = FirebaseFirestore.DocumentSnapshot
import FieldPath = FirebaseFirestore.FieldPath
export interface MappedDocumentSnapshot extends DocumentSnapshot {
    // no changes needed
}
export const data = (snapshot:  DocumentSnapshot) => ()=> snapshot.data()
export const get = (snapshot:  DocumentSnapshot) => (fieldPath: string|FieldPath)=> snapshot.get(fieldPath)
export const isEqual = (snapshot:  DocumentSnapshot) => (other: DocumentSnapshot)=> snapshot.isEqual(other)
export const exists = (snapshot: DocumentSnapshot) => snapshot.exists
export const updateTime = (snapshot: DocumentSnapshot) => snapshot.updateTime
export const readTime = (snapshot: DocumentSnapshot) => snapshot.readTime
export const createTime = (snapshot: DocumentSnapshot) => snapshot.createTime
export const id = (snapshot: DocumentSnapshot) => snapshot.id
export const ref = (snapshot: DocumentSnapshot) => snapshot.ref
export default data