import { db } from '../firebase'
import {
  collection,
  query,
  addDoc,
  where,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
} from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { FormEvent, useState } from 'react'
import Search from './Search'

export default function UserClasses() {
  const [currentClasses, setCurrentClasses]: any[] = useState([])

  const classesRef = collection(db, 'classes')
  const [classValue, classLoading, classError] = useCollection(
    query(classesRef, orderBy('department'))
  )
  const classDoc = doc(db, 'classes', 'CSCI 0190')
  const recordsRef = collection(db, 'users', 'QpDjNV8TwCqg1hWNNtE5', 'classes')
  const [userClasses, loading, error] = useCollection(query(recordsRef))

  function loadClasses() {
    const docs: QueryDocumentSnapshot<DocumentData>[] | undefined =
      userClasses?.docs
    const a = []
    if (docs !== undefined) {
      for (let i = 0; i < docs?.length; i++) {
        const jsonString: string = JSON.stringify(docs[i].data())
        const obj = JSON.parse(jsonString)
        a.push(obj.name)
      }
    }
    console.log(a)
    setCurrentClasses(a)
  }

  return (
    <>
      <section className="bg-white rounded-lg p-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={loadClasses}
        >
          Show Current Classes
        </button>

        <ul>
          {currentClasses.map((c: string) => (
            <li>{c}</li>
          ))}
        </ul>
      </section>
      <Search />
    </>
  )
}
