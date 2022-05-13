import { DocumentData, DocumentReference } from 'firebase/firestore'

// TODO: eventually make into a class?
// represents an individual record of a user
export default interface UserRecord {
  class: DocumentReference<DocumentData>
  class_name: string
  start: Date
  finish: Date
  duration: number
  assignment?: string
}
