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
  const [className, setClassName] = useState('')
  const [timeStamp, setTimeStamp] = useState('')
  const [duration, setDuration] = useState('')

  async function addClass(event: FormEvent) {
    event.preventDefault()

    await addDoc(classesRef, {
      name: newClassName,
      department: newClassDepartment,
    })
  }

  const docs: QueryDocumentSnapshot<DocumentData>[] | undefined = recValue?.docs

  const durationRecords: number[] = []
  const classRecords: string[] = []
  const timeRecords: string[] = []
  const children: string[][] = []

  if (docs !== undefined) {
    for (let i = 0; i < docs?.length; i++) {
      const jsonString: string = JSON.stringify(docs[i].data())
      const obj = JSON.parse(jsonString)
      const finishStamp = new Date(
        JSON.parse(JSON.stringify(obj.finish)).seconds * 1000
      )
      console.log(obj.duration)
      console.log(finishStamp)
      console.log(obj.class_name)
      durationRecords.push(obj.duration / 100)
      classRecords.push(obj.class_name)
      timeRecords.push(finishStamp.toISOString())
      children.push([
        (obj.duration / 100).toString(),
        obj.class_name,
        finishStamp.toISOString(),
      ])
    }
  }
  console.log(durationRecords)
  console.log(classRecords)
  console.log(timeRecords)
  console.log(children)

  return (
    <section className="bg-black w-full rounded-lg">
      <h1 className="text-black font-bold">My Classes</h1>
      <Stack direction="row" spacing={0}>
        <Box
          className="bg-white w-1/2 p-4"
          sx={{
            height: 300,
            borderRadius: 5,
          }}
        >
          <div className="text-xl font-bold">Class Name: {className}</div>
          <div className="text-xl font-bold">Time Stamp: {timeStamp}</div>
          <div className="text-xl font-bold">Duration: {duration}</div>
        </Box>
        <GraphBackground
          width={300}
          children={children}
          setClassName={setClassName}
          setTimeStamp={setTimeStamp}
          setDuration={setDuration}
        />
      </Stack>
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
