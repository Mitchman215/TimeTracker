import { db } from '../firebase'
import {
  collection,
  query,
  addDoc,
  where,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { FormEvent, useState } from 'react'
import leven from 'leven'

export default function Search() {
  const [result, setResult] = useState('') // the user search, need to rename
  const [category, setCategory] = useState('name')
  const [suggestions, setSuggestions]: any[] = useState([])
  const [classes, setClasses]: any[] = useState([])
  const [departments, setDepartments] = useState(new Set())

  const classesRef = collection(db, 'classes')

  const [classValue, classLoading, classError] = useCollection(
    query(classesRef, orderBy('department'))
  )

  const [value, loading, error] = useCollection(
    query(classesRef, where(category, '==', result))
  )

  function closestVals(userSearch: string, userCategory: string) {
    const docs: QueryDocumentSnapshot<DocumentData>[] | undefined =
      classValue?.docs
    const a = []
    const b = new Set()
    if (docs !== undefined) {
      setClasses([])
      setDepartments(new Set())
      for (let i = 0; i < docs?.length; i++) {
        const jsonString: string = JSON.stringify(docs[i].data())
        const obj = JSON.parse(jsonString)
        a.push(obj.name)
        b.add(obj.department)
      }
      setClasses(a)
      setDepartments(b)
    }
    let type: any[]
    if (userCategory === 'name') {
      type = classes
    } else {
      type = Array.from(departments)
    }
    const distances = []
    for (let i = 0; i < type.length; i++) {
      const distance = leven(userSearch, type[i])
      distances.push([type[i], distance])
    }
    distances.sort((first, second) => {
      return first[1] - second[1]
    })
    setSuggestions([distances[0][0], distances[1][0], distances[2][0]])
  }

  return (
    <section className="bg-white rounded-lg p-4">
      <h1 className="text-black font-bold">Search</h1>
      <select id="category" onChange={(e) => setCategory(e.target.value)}>
        <option value="name">Name</option>
        <option value="department">Department</option>
      </select>
      <input
        placeholder="Search for an assignment / class / department"
        onChange={(e) => closestVals(e.target.value, category)}
      />
      {suggestions.map((c: string) => (
        <div>
          <button type="button">{c}</button>
        </div>
      ))}
    </section>
  )
}
