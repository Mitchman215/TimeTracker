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
  const docs1: QueryDocumentSnapshot<DocumentData>[] | undefined =
    userClassesSnapshot?.docs
  const userClassNames = []
  if (docs1 !== undefined) {
    for (let i = 0; i < docs1?.length; i++) {
      const jsonString: string = JSON.stringify(docs1[i].data())
      const obj = JSON.parse(jsonString)
      userClassNames.push(obj.name)
    }
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
    }

    const distances = []
    const keys = Array.from(allClasses.keys())
    // for each class, the levenstein distance is computed and stored in a 2-D array to be sorted by distance
    for (let i = 0; i < keys.length; i++) {
      const distance = leven(userSearch.toLowerCase(), keys[i].toLowerCase())
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
  function addClass() {
    addDoc(allClassesDB, {
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
      <div className="grid grid-cols-3 gap-5">
        <div>
          <h1 className="text-gray-900 text-xl leading-tight font-medium mb-2">
            Current Classes
          </h1>
          <ul className="list-disc">
            {userClassNames.map((name: string) => (
              <li>{name}</li>
            ))}
          </ul>
        </div>

        <div>
          <h1 className="text-gray-900 text-xl leading-tight font-medium mb-2">
            Add an existing class to your classes
          </h1>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Search Here"
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
        </div>

        <div>
          <h1 className="text-gray-900 text-xl leading-tight font-medium mb-2">
            Can't find one of your classes? Add it here
          </h1>
          <form>
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
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={addClass}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
