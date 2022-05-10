import {
  collection,
  DocumentData,
  query,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useContext } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase'
import UserContext from '../../models/UserContext'
import { UserClassDoc } from '../../types'
import UserClassMenu from '../user_comparisons/UserClassMenu'

/**
 * Scrapes information from a specific user's courses and displays it
 * @returns A layout for comparison
 */
const UserComp = () => {
  const user = useContext(UserContext)
  const userID = user?.uid
  const userClassesRef = collection(db, `users/${userID}/classes/`)

  const [userClassesValue] = useCollection(query(userClassesRef))

  const userClassesDocs: QueryDocumentSnapshot<DocumentData>[] | undefined =
    userClassesValue?.docs

  const userClassChildren: UserClassDoc[] = []

  // Creates an array of user class docs which contains time information on a user's classes
  if (userClassesDocs !== undefined) {
    for (let i = 0; i < userClassesDocs?.length; i++) {
      try {
        const userClassDoc = userClassesDocs[i].data() as UserClassDoc
        userClassDoc.added = false
        userClassChildren.push(userClassDoc)
      } catch (error) {
        console.log('no scraping information')
      }
    }
  }

  return (
    <section className="bg-black w-full rounded-lg p-10" id="user-bg">
      <h1 className="text-white font-bold" id="user-title">
        Compare Time on Classes Visualizer
      </h1>
      <UserClassMenu children={userClassChildren} />
    </section>
  )
}

export default UserComp
