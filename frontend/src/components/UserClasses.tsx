import { db } from '../firebase'
import {
  collection,
  query,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  setDoc,
} from 'firebase/firestore'
import {
  useCollection,
  useCollectionData,
} from 'react-firebase-hooks/firestore'
import { useContext, useState } from 'react'
import leven from 'leven'
import UserContext from '../models/UserContext'
import NewClassForm from './NewClassForm'
import UserClass from '../models/UserClass'

export default function UserClasses() {
  // get the user from the context
  const user = useContext(UserContext)
  if (user === null) {
    throw new Error('No user logged in')
  }
  // a given user's data for their classes
  const userClassesDB = user.typedClassesRef
  const [userClasses] = useCollectionData(userClassesDB)

  // the user's current classes to display
  const userClassIds: string[] = userClasses ? userClasses.map((c) => c.id) : []

  // all aggregated class data
  const allClassesDB = collection(db, 'classes')
  const [allClassesQuery] = useCollection(
    query(allClassesDB, orderBy('department'))
  )

  // loads in every class into a hashmap with the key being the id and the value being the class's name
  const classDocs: QueryDocumentSnapshot<DocumentData>[] =
    allClassesQuery !== undefined ? allClassesQuery.docs : []
  const allClassesMap: Map<string, string> = new Map()
  classDocs.forEach((d) => allClassesMap.set(d.id, d.data().name))

  // state variable for suggestions while searching
  const [suggestions, setSuggestions] = useState<string[]>([])
  const numSuggestions = 10 // controls how many suggestions are displayed

  interface IdDistance {
    id: string
    distance: number
  }

  // takes in a string from the user input in the search bar, and returns the top three most similar class names
  // based on levenstein distance
  function closestVals(userSearch: string) {
    const distances: IdDistance[] = []
    const keys = Array.from(allClassesMap.keys())
    // for each class, the levenstein distance is computed and stored in a 2-D array to be sorted by distance
    for (let i = 0; i < keys.length; i++) {
      const distance = leven(userSearch.toUpperCase(), keys[i].toUpperCase())
      distances.push({ id: keys[i], distance })
    }
    // sort suggestions by distances
    distances.sort((first, second) => {
      return first.distance - second.distance
    })
    // sets suggestions to the most similar classes' ids that the user doesn't have already
    const results = distances
      .map((d) => d.id)
      .filter((id) => !userClassIds.includes(id))
      .slice(0, numSuggestions)
    setSuggestions(results)
  }

  // takes in an existing class name selected by the user, and adds the corresponding class to the user's list of current classes
  function addClassToUser(classId: string) {
    if (userClassIds.includes(classId)) {
      console.warn(
        'User tried to add a class they already have, should be impossible'
      )
    } else {
      const className = allClassesMap.get(classId)
      if (className) {
        setDoc(doc(userClassesDB, classId), new UserClass(classId, className))
        // remove the added class from the suggestions
        setSuggestions(
          suggestions.filter((suggestion) => suggestion !== classId)
        )
      } else {
        // className was either blank or undefined
        console.error(
          `Database error: the stored name for class with id "${classId}" in firestore was blank or undefined.`
        )
        console.log({ allClassesMap })
      }
    }
  }

  async function onClickClass(classId: string) {
    if (userClassIds.includes(classId)) {
      const proceed = await confirm(
        `Are you sure you want to delete ${classId}? All your study records for this class will also be deleted (this can't be reversed).`
      )
      if (proceed) {
        user?.deleteClass(classId)
      } else {
        console.log(`Not deleting ${classId}`)
      }
    }
  }

  return (
    <section className="bg-white rounded-lg p-4">
      <div className="grid grid-cols-3 gap-5">
        <div>
          <h1 className="text-gray-900 text-xl leading-tight font-medium mb-2">
            Current Classes
          </h1>
          <ul className="list-disc pl-5">
            {userClassIds.map((name: string) => (
              <li key={name} className="my-2">
                <button
                  className="hover:line-through "
                  onClick={() => onClickClass(name)}
                >
                  {name}
                </button>
              </li>
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
          <div className="flex flex-col justify-between gap-2 mt-2">
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
        </div>

        <div>
          <h1 className="text-gray-900 text-xl leading-tight font-medium">
            Can't find one of your classes? Add it here
          </h1>
          <NewClassForm />
        </div>
      </div>
    </section>
  )
}
