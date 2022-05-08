import {
  collection,
  DocumentData,
  query,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase'
import { DptClassDoc } from '../../types'
import CompGraphLayout from '../dpt_class_comparison/CompGraphLayout'

/**
 * Scrapes the information from firebase on all databases and displays it
 * @returns A layout for comparison
 */
const DepartmentComp = () => {
  const dptRef = collection(db, 'departments')

  const [dptValue] = useCollection(query(dptRef))

  const dptDocs: QueryDocumentSnapshot<DocumentData>[] | undefined =
    dptValue?.docs

  const dptChildren: DptClassDoc[] = []

  // Creates an array of dptclassdoc which contains time information on every dpt
  if (dptDocs !== undefined) {
    for (let i = 0; i < dptDocs?.length; i++) {
      try {
        const dptChild: DptClassDoc = dptDocs[i].data() as DptClassDoc
        dptChild.added = false
        dptChildren.push(dptChild)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <section className="bg-black w-full rounded-lg p-10">
      <h1 className="text-white font-bold">Department Comparison Visualizer</h1>
      <CompGraphLayout children={dptChildren} type={'Department'} />
    </section>
  )
}

export default DepartmentComp
