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
import User from '../models/User'

type UserClassesProps = {
  user: User
}

export default function UserClasses({ user }: UserClassesProps) {
  // a given user's data for their classes
  const userClassesDB = collection(db, 'users', user.uid, 'classes')
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
  const userClassNames: string[] = []
  if (docs1 !== undefined) {
    for (let i = 0; i < docs1?.length; i++) {
      const jsonString: string = JSON.stringify(docs1[i].data())
      const obj = JSON.parse(jsonString)
      userClassNames.push(obj.name)
    }
  }

  // state variable for top three suggestions while searching
  const [suggestions, setSuggestions]: any[] = useState([])

  // loads in every class into a hashmap with the key being the name and the value being the firebase reference
  const classDocs: QueryDocumentSnapshot<DocumentData>[] | undefined =
    classValue?.docs
  const allClassesMap = new Map()
  if (classDocs !== undefined) {
    for (let i = 0; i < classDocs?.length; i++) {
      const jsonString: string = JSON.stringify(classDocs[i].data())
      const ref = classDocs[i].ref
      const obj = JSON.parse(jsonString)
      allClassesMap.set(obj.name, ref)
    }
  }

  // takes in a string from the user input in the search bar, and returns the top three most similar class names
  // based on levenstein distance
  function closestVals(userSearch: string) {
    const distances = []
    const keys = Array.from(allClassesMap.keys())
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
  async function addClass(event: FormEvent) {
    event.preventDefault()
    if (allClassesMap.has(newClassName)) {
      console.log('User tried to add a class that already exists')
    } else {
      await addDoc(allClassesDB, {
        daily_average: '0',
        department: newClassDepartment,
        name: newClassName,
        total_time: '0',
        weekly_average: '0',
      })
    }
  }

  // takes in an existing class name selected by the user, and adds the corresponding class to the user's list of current classes
  function addClassToUser(className: string) {
    if (userClassNames.includes(className)) {
      console.log('User tried to add a class they already have.')
    } else {
      setDoc(doc(userClassesDB, className), {
        class: allClassesMap.get(className),
        daily_averages: [],
        id: allClassesMap.get(className).id,
        monthly_averages: [],
        name: className,
        weekly_averages: [],
      })
    }
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
              <li key={name}>{name}</li>
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
            <div key={className}>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => addClassToUser(className)}
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
