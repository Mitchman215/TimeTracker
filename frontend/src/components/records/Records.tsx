import {
  collection,
  DocumentData,
  DocumentReference,
  query,
  where,
} from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase'
import Card from '../Card'
import NewRecord from './NewRecord'
import Record from './Record'

type RecordsProps = {
  classDoc: DocumentReference<DocumentData>
  userId: string
}

export default function Records({ classDoc, userId }: RecordsProps) {
  const recordsRef = collection(db, 'users', userId, 'records')
  const [snapshot, loading, error] = useCollection(
    query(recordsRef, where('class', '==', classDoc))
  )

  return (
    <Card>
      {loading && <h1>Loading...</h1>}
      {error && (
        <>
          <h1>Error</h1>
          <p>{error.message}</p>
        </>
      )}
      {snapshot && (
        <>
          <h1 className="font-bold text-xl">Time Records for {classDoc.id}</h1>
          <div className="mt-4 space-y-2">
            {snapshot.docs.map((doc) => (
              <Record key={doc.id} doc={doc} />
            ))}
            <NewRecord classDoc={classDoc} recordsRef={recordsRef} />
          </div>
        </>
      )}
    </Card>
  )
}
