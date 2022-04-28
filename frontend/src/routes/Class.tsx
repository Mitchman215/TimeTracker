import { db } from '../firebase'
import { collection, query, orderBy, addDoc } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { FormEvent, useState } from 'react'

export default function Classes() {
  const classesRef = collection(db, 'classes')

  const [value, loading, error] = useCollection(
    query(classesRef, orderBy('department'))
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

  return (
    <section className="bg-white rounded-lg p-4">
      <h1 className="text-black font-bold">My Classes</h1>
      <div>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value &&
          value.docs.map((doc) => (
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