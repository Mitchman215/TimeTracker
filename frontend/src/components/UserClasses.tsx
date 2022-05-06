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
  setDoc,
} from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { FormEvent, useState } from 'react'
import leven from 'leven'

export default function UserClasses() {
  const [userClasses, setUserClasses]: any[] = useState([])
  const userClassesDB = collection(
    db,
    'users',
    'QpDjNV8TwCqg1hWNNtE5',
    'classes'
  )
  const [userClassesSnapshot, loading, error] = useCollection(userClassesDB)

  const [allClasses, setAllClasses] = useState(new Map())
  const allClassesDB = collection(db, 'classes')
  const [classValue, classLoading, classError] = useCollection(
    query(allClassesDB, orderBy('department'))
  )

  function loadClasses() {
    const docs: QueryDocumentSnapshot<DocumentData>[] | undefined =
      userClassesSnapshot?.docs
    const tempClasses = []
    if (docs !== undefined) {
      for (let i = 0; i < docs?.length; i++) {
        const jsonString: string = JSON.stringify(docs[i].data())
        const obj = JSON.parse(jsonString)
        tempClasses.push(obj.name)
      }
    }
    setUserClasses(tempClasses)
  }

  const [suggestions, setSuggestions]: any[] = useState([])
  function closestVals(userSearch: string) {
    const docs: QueryDocumentSnapshot<DocumentData>[] | undefined =
      classValue?.docs
    const temp = new Map()
    if (docs !== undefined) {
      setAllClasses(new Map())
      for (let i = 0; i < docs?.length; i++) {
        const jsonString: string = JSON.stringify(docs[i].data())
        const ref = docs[i].ref
        const obj = JSON.parse(jsonString)
        temp.set(obj.name, ref)
      }
      setAllClasses(temp)
      console.log(temp)
    }

    const distances = []
    const keys = Array.from(allClasses.keys())

    for (let i = 0; i < keys.length; i++) {
      const distance = leven(userSearch, keys[i])
      distances.push([keys[i], distance])
    }
    distances.sort((first, second) => {
      return first[1] - second[1]
    })
    setSuggestions([distances[0][0], distances[1][0], distances[2][0]])
  }

  const [newClassName, setNewClassName] = useState('')
  const [newClassDepartment, setNewClassDepartment] = useState('')
  async function addClass(event: FormEvent) {
    event.preventDefault()

    await addDoc(allClassesDB, {
      daily_average: '0',
      department: newClassDepartment,
      name: newClassName,
      total_time: '0',
      weekly_average: '0',
    })
  }

  function addClassToUser(className: string) {
    setDoc(doc(userClassesDB, className), {
      class: allClasses.get(className),
      daily_averages: [],
      id: allClasses.get(className).id,
      monthly_averages: [],
      name: className,
      weekly_averages: [],
    })
  }

  return (
    <section className="bg-white rounded-lg p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={loadClasses}
      >
        Show Current Classes
      </button>
      <ul>
        {userClasses.map((c: string) => (
          <li>{c}</li>
        ))}
      </ul>

      <input
        placeholder="Search for an existing class"
        onChange={(e) => closestVals(e.target.value)}
      />
      {suggestions.map((className: string) => (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => addClassToUser(className)} //
          >
            {className}
          </button>
        </div>
      ))}
      <br></br>
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
