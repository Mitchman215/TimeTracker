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

export default function Search() {
  const [result, setResult] = useState('')
  const [category, setCategory] = useState('name')
  const [suggestions, setSuggestions]: any[] = useState([])
  const [classes, setClasses]: any[] = useState([])
  const [departments, setDepartments] = useState(new Set())

  const classesRef = collection(db, 'classes')

  const [classValue, classLoading, classError] = useCollection(
    query(classesRef, orderBy('department'))
  )

  function loadClassesDepts() {
    // adds classes and departments from database to an array and set
    const docs: QueryDocumentSnapshot<DocumentData>[] | undefined =
      classValue?.docs
    if (docs !== undefined) {
      for (let i = 0; i < docs?.length; i++) {
        const jsonString: string = JSON.stringify(docs[i].data())
        const obj = JSON.parse(jsonString)
        setClasses(classes.push(obj.name))
        setDepartments(departments.add(obj.department))
        //classes.push(obj.name)
        //departments.add(obj.department)
      }
    }
  }

  const docs: QueryDocumentSnapshot<DocumentData>[] | undefined =
    classValue?.docs
  if (docs !== undefined) {
    for (let i = 0; i < docs?.length; i++) {
      const jsonString: string = JSON.stringify(docs[i].data())
      const obj = JSON.parse(jsonString)
      //setClasses(classes.push(obj.name))
      //setDepartments(departments.add(obj.department))
      classes.push(obj.name)
      departments.add(obj.department)
    }
  }

  const [value, loading, error] = useCollection(
    query(classesRef, where(category, '==', result))
  )

  function closestVals(userSearch: string, userCategory: string) {
    let type: any[]
    if (userCategory === 'name') {
      type = classes
    } else {
      type = Array.from(departments)
    }
    if (type.includes(userSearch)) {
      setSuggestions([userSearch, userSearch])
      //return [userSearch, userSearch]
    } else {
      setSuggestions([])
      //return []
    }
  }

  return (
    <section className="bg-white rounded-lg p-4">
      <h1 className="text-black font-bold">Search</h1>
      {suggestions.map((c: string) => (
        <p>{c}</p>
      ))}
      <select id="category" onChange={(e) => setCategory(e.target.value)}>
        <option value="name">Name</option>
        <option value="department">Department</option>
      </select>
      <input
        placeholder="Search for an assignment / class / department"
        //onChange={(e) => setResult(e.target.value)}
        onChange={(e) => closestVals(e.target.value, category)}
      />
      {value &&
        value.docs.map((doc) => (
          <p key={doc.id}>{JSON.stringify(doc.data())}, </p>
        ))}
    </section>
  )
}
