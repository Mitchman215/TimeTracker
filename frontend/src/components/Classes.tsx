import { db } from '../firebase'
import {
  collection,
  query,
  orderBy,
  addDoc,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { Box, Stack } from '@mui/material'
import { useCollection } from 'react-firebase-hooks/firestore'
import { FormEvent, useState, useCallback, SetStateAction } from 'react'
import GraphBackground from './GraphBackground'
import GraphLayout from './GraphLayout'
import DptGraphLayout from './DptGraphLayout'

export default function Classes() {
  const classesRef = collection(db, 'classes')
  const dptRef = collection(db, 'departments')
  const usersRef = collection(db, 'users')
  const userID = 'QpDjNV8TwCqg1hWNNtE5'
  const recordsRef = collection(db, `users/${userID}/records/`)

  const [classValue, classLoading, classError] = useCollection(
    query(classesRef)
  )
  const [dptValue, dptLoading, dptError] = useCollection(query(dptRef))
  const [userValue, userLoading, userError] = useCollection(
    query(usersRef, orderBy('email'))
  )
  const [recValue, recLoading, recError] = useCollection(query(recordsRef))
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
  const dptDocs: QueryDocumentSnapshot<DocumentData>[] | undefined =
    dptValue?.docs

  const children: string[][] = []

  if (docs !== undefined) {
    for (let i = 0; i < docs?.length; i++) {
      const jsonString: string = JSON.stringify(docs[i].data())
      const obj = JSON.parse(jsonString)
      const finishStamp = new Date(
        JSON.parse(JSON.stringify(obj.finish)).seconds * 1000
      )
      const startStamp = new Date(
        JSON.parse(JSON.stringify(obj.start)).seconds * 1000
      )
      children.push([
        (obj.duration / 100).toString(),
        obj.class_name,
        startStamp.toLocaleString(),
        finishStamp.toLocaleString(),
      ])
    }
  }
  console.log(children)

  const dptChildren: string[][] = []

  if (dptDocs !== undefined) {
    for (let i = 0; i < dptDocs?.length; i++) {
      const jsonString: string = JSON.stringify(dptDocs[i].data())
      const obj = JSON.parse(jsonString)
      dptChildren.push([
        obj.daily_average,
        obj.name,
        obj.weekly_average,
        obj.total_time,
      ])
    }
  }

  return (
    <section className="bg-black w-full rounded-lg p-2">
      <h1 className="text-white font-bold">My Classes</h1>
      <GraphLayout children={children} user={userID} />
      <DptGraphLayout children={dptChildren} />
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
