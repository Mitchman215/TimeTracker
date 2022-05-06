import { db } from '../firebase'

import {
  collection,
  query,
  addDoc,
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
  // a given user's data for their classes
  const [userClasses, setUserClasses]: any[] = useState([])
  const userClassesDB = collection(
    db,
    'users',
    'QpDjNV8TwCqg1hWNNtE5',
    'classes'
  )
  const [userClassesSnapshot, loading, error] = useCollection(userClassesDB)

  // all aggregated class data
  const [allClasses, setAllClasses] = useState(new Map())
  const allClassesDB = collection(db, 'classes')
  const [classValue, classLoading, classError] = useCollection(
    query(allClassesDB, orderBy('department'))
  )

  // loads and sets in the user's current classes to display
  function loadUserClasses() {
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

  // state variable for top three suggestions while searching
  const [suggestions, setSuggestions]: any[] = useState([])

  // takes in a string from the user input in the search bar, and returns the top three most similar class names
  // based on levenstein distance
  function closestVals(userSearch: string) {
    const docs: QueryDocumentSnapshot<DocumentData>[] | undefined =
      classValue?.docs  
    // loads in every class first
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
    // for each class, the levenstein distance is computed and stored in a 2-D array to be sorted by distance
    for (let i = 0; i < keys.length; i++) {
      const distance = leven(userSearch, keys[i])
      distances.push([keys[i], distance])
    }
    distances.sort((first, second) => {
      return first[1] - second[1]
    })
    // sets the three smallest levenstein distanes as suggestions
    setSuggestions([distances[0][0], distances[1][0], distances[2][0]])
  }

  // state variables for a new class and its department inputted by the user
  const [newClassName, setNewClassName] = useState('')
  const [newClassDepartment, setNewClassDepartment] = useState('')

  // creates a new class in the collection of classes and sets its averages and total time to 0
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

  // takes in an existing class name selected by the user, and adds the corresponding class to the user's list of current classes
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
        onClick={loadUserClasses}
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
