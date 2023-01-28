import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { useContext, useEffect, useRef, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import Card from '../components/Card'
import UserRecords from '../components/data_visualization/UserRecords'
import Records from '../components/records/Records'
import UserContext from '../models/UserContext'

export default function UserRecordsRoute() {
  const user = useContext(UserContext)
  if (user === null) {
    throw new Error('No user logged in')
  }

  const [classes, loading, error] = useCollection(user.classesRef)
  const [curClass, setCurClass] =
    useState<QueryDocumentSnapshot<DocumentData>>()

  function setCurClassFromId(id: string) {
    setCurClass(classes?.docs.filter((a_class) => a_class.id == id)[0])
  }

  const initializeCurClass: React.MutableRefObject<boolean> = useRef(false)

  useEffect(() => {
    if (!classes || initializeCurClass.current) {
      return
    }

    setCurClass(classes.docs[0])
    initializeCurClass.current = true
  }, [classes])

  return (
    <>
      <section>
        <UserRecords />
      </section>
      <section className="mt-5">
        <Card>
          {loading && <h1>Loading...</h1>}
          {error && (
            <>
              <h1>Error</h1>
              <p>{error.message}</p>
            </>
          )}
          {classes && (
            <>
              <select
                value={curClass?.id}
                onChange={(e) => setCurClassFromId(e.target.value)}
                className="rounded-lg border-2 p-2 mb-2"
              >
                {classes.docs.map((a_class) => (
                  <option key={a_class.id} value={a_class.id}>
                    {a_class.data().id}
                  </option>
                ))}
              </select>

              {curClass && (
                <Records classDoc={curClass.data().class} userId={user.uid} />
              )}
            </>
          )}
        </Card>
      </section>
    </>
  )
}
