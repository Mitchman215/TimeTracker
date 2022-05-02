import { useParams } from 'react-router-dom'
import Records from '../components/records/Records'

import { doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import Card from '../components/Card'
import { User } from 'firebase/auth'

type ClassURLParams = {
  classId: string
}

type ClassProps = {
  user: User
}

export default function Class({ user }: ClassProps) {
  const { classId } = useParams() as ClassURLParams

  const classDoc = doc(db, 'classes', classId)
  const [value, loading, error] = useDocumentDataOnce(classDoc)

  return (
    <>
      {loading && (
        <Card>
          <h1>Loading...</h1>
        </Card>
      )}
      {error && (
        <Card>
          <h1>Error loading</h1>
          <p>{error.message}</p>
        </Card>
      )}
      {!loading && !value && (
        <Card>
          <h1>Class "{classId}" does not have any data yet</h1>
        </Card>
      )}
      {value && <Records classDoc={classDoc} userId={user.uid} />}
    </>
  )
}
