import {
  collection,
  DocumentData,
  query,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase'
import UserContext from '../../models/UserContext'
import { RecordClassDoc } from '../../types'
import GraphLayout from '../user_records/GraphLayout'

/**
 * Scrapes infromation on each record from a specific user and displays it
 * @returns A layout for comparison
 */
const UserRecords = () => {
  const user = useContext(UserContext)
  const userID = user?.uid
  const userName = user?.email
  const recordsRef = collection(db, `users/${userID}/records/`)

  const [recValue] = useCollection(query(recordsRef))

  const docs: QueryDocumentSnapshot<DocumentData>[] | undefined = recValue?.docs

  const children: RecordClassDoc[] = []

  // Creates an array of RecordClassDoc containing all of the entered records of a certain user
  if (docs !== undefined) {
    for (let i = 0; i < docs?.length; i++) {
      try {
        const child: RecordClassDoc = docs[i].data() as RecordClassDoc
        children.push(child)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <section className="bg-black w-full rounded-lg p-10">
      <h1 className="text-white font-bold">Record Comparison Visualizer</h1>
      {userName != undefined && (
        <GraphLayout children={children} user={userName} />
      )}
    </section>
  )
}

export default UserRecords
