import { db } from '../firebase'
import {
  collection,
  query,
  orderBy,
  addDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { FormEvent, useState } from 'react'
import GraphBackground from './GraphBackground'

export default function Classes() {
  const classesRef = collection(db, 'classes')
  const usersRef = collection(db, 'users')
  const recordsRef = collection(db, 'users/QpDjNV8TwCqg1hWNNtE5/records/')

  const [classValue, classLoading, classError] = useCollection(
    query(classesRef, orderBy('department'))
  )

  const [userValue, userLoading, userError] = useCollection(
    query(usersRef, orderBy('email'))
  )

  const [recValue, recLoading, recError] = useCollection(
    query(recordsRef, orderBy('duration'))
  )
  const [newClassName, setNewClassName] = useState('')
  const [newClassDepartment, setNewClassDepartment] = useState('')

  async function addClass(event: FormEvent) {
    event.preventDefault()

    await addDoc(classesRef, {
      name: newClassName,
      department: newClassDepartment,
    })
  }

  const docs: QueryDocumentSnapshot<DocumentData>[] | undefined = recValue?.docs

  const newRecords: number[] = []
  if (docs !== undefined) {
    for (let i = 0; i < docs?.length; i++) {
      console.log(`true`)
      const jsonString: string = JSON.stringify(docs[i].data())
      const obj = JSON.parse(jsonString)
      const finishStamp = new Date(
        JSON.parse(JSON.stringify(obj.finish)).seconds * 1000
      )
      console.log(obj.duration)
      console.log(finishStamp)
      newRecords.push(obj.duration)
    }
  }

  const [durationData] = useState(newRecords)

  return (
    <section className="bg-white rounded-lg p-4">
      <h1 className="text-black font-bold">My Classes</h1>
      <div>
        {classError && <strong>Error: {JSON.stringify(classError)}</strong>}
        {classLoading && <span>Collection: Loading...</span>}
        {classValue &&
          classValue.docs.map((doc) => (
            <p key={doc.id}>{JSON.stringify(doc.data())}, </p>
          ))}
      </div>
      <div>
        {userError && <strong>Error: {JSON.stringify(userError)}</strong>}
        {userLoading && <span>Collection: Loading...</span>}
        {userValue &&
          userValue.docs.map((doc) => (
            <p key={doc.id}>{JSON.stringify(doc.data())}, </p>
          ))}
      </div>
      <GraphBackground children={durationData}></GraphBackground>
      <div>
        {recError && <strong>Error: {JSON.stringify(recError)}</strong>}
        {recLoading && <span>Collection: Loading...</span>}
        {recValue &&
          recValue.docs.map((doc) => (
            <p key={doc.id}>{JSON.stringify(doc.data())}, </p>
          ))}
      </div>
      <form onSubmit={addClass}>
        <input
          value={newClassDepartment}
          placeholder="Class department"
          onChange={(e) => setNewClassDepartment(e.target.value)}
        />
        <input
          value={newClassName}
          placeholder="Class name"
          onChange={(e) => setNewClassName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </section>
  )
}
