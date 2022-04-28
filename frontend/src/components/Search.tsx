import { db } from '../firebase'
import { collection, query, addDoc, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { FormEvent, useState } from 'react'

export default function Search() {
  const [result, setResult] = useState('')
  const [category, setCategory] = useState('name')
  const classesRef = collection(db, 'classes')

  const [value, loading, error] = useCollection(
    query(classesRef, where(category, '==', result))
  )

  return (
    <section className="bg-white rounded-lg p-4">
      <h1 className="text-black font-bold">Search</h1>
      <select id="category" onChange={(e) => setCategory(e.target.value)}>
        <option value="name">Name</option>
        <option value="department">Department</option>
      </select>
      <input
        placeholder="Search for an assignment / class / department"
        onChange={(e) => setResult(e.target.value)}
      />
      {value &&
        value.docs.map((doc) => (
          <p key={doc.id}>{JSON.stringify(doc.data())}, </p>
        ))}
    </section>
  )
}
