import { db } from '../firebase'
import {
  collection,
  query,
  addDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { FormEvent, useState } from 'react'
import GraphLayout from './user_records/GraphLayout'
import CompGraphLayout from './dpt_class_comparison/CompGraphLayout'
import UserClassMenu from './user_comparisons/UserClassMenu'
import { DptClassDoc, RecordClassDoc, UserClassDoc } from '../types'

export default function Classes() {
  const classesRef = collection(db, 'classes')
  const dptRef = collection(db, 'departments')
  const userID = 'QpDjNV8TwCqg1hWNNtE5'
  const recordsRef = collection(db, `users/${userID}/records/`)
  const userClassesRef = collection(db, `users/${userID}/classes/`)

  const [classValue] = useCollection(query(classesRef))
  const [dptValue] = useCollection(query(dptRef))
  const [recValue, recLoading, recError] = useCollection(query(recordsRef))
  const [userClassesValue] = useCollection(query(userClassesRef))
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
  const classDocs: QueryDocumentSnapshot<DocumentData>[] | undefined =
    classValue?.docs
  const userClassesDocs: QueryDocumentSnapshot<DocumentData>[] | undefined =
    userClassesValue?.docs

  const children: RecordClassDoc[] = []

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

  const dptChildren: DptClassDoc[] = []

  if (dptDocs !== undefined) {
    for (let i = 0; i < dptDocs?.length; i++) {
      try {
        const dptChild: DptClassDoc = dptDocs[i].data() as DptClassDoc
        dptChild.added = false
        dptChildren.push(dptChild)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const classChildren: DptClassDoc[] = []

  if (classDocs !== undefined) {
    for (let i = 0; i < classDocs?.length; i++) {
      try {
        const classChild: DptClassDoc = classDocs[i].data() as DptClassDoc
        classChild.added = false
        classChildren.push(classChild)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const userClassChildren: UserClassDoc[] = []

  if (userClassesDocs !== undefined) {
    for (let i = 0; i < userClassesDocs?.length; i++) {
      try {
        const userClassDoc = userClassesDocs[i].data() as UserClassDoc
        userClassDoc.added = false
        userClassChildren.push(userClassDoc)
      } catch (error) {
        console.log('no scraping information')
      }
    }
  }

  return (
    <section className="bg-black w-full rounded-lg p-10">
      <h1 className="text-white font-bold">My Classes</h1>
      <GraphLayout children={children} user={userID} />
      <CompGraphLayout children={dptChildren} type={'Department'} />
      <CompGraphLayout children={classChildren} type={'Class'} />
      <UserClassMenu children={userClassChildren} />
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
