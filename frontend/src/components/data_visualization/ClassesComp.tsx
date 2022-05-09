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
 * Scrapes the information on all classes from firebase and displays a layout
 * for comparison
 * @returns A layout for comparison
 */
const ClassesComp = () => {
  const classesRef = collection(db, 'classes')

  const [classValue] = useCollection(query(classesRef))

  const classDocs: QueryDocumentSnapshot<DocumentData>[] | undefined =
    classValue?.docs

  const classChildren: DptClassDoc[] = []

  // Creates an array of dptclassdoc which contains time information on all of the classes
  if (classDocs !== undefined) {
    for (let i = 0; i < classDocs?.length; i++) {
      try {
        const classChild: DptClassDoc = classDocs[i].data() as DptClassDoc
        classChild.added = false
        classChildren.push(classChild)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <section className="bg-black w-full rounded-lg p-10">
      <h1 className="text-white font-bold">Class Comparison Visualizer</h1>
      <CompGraphLayout children={classChildren} type={'Class'} />
    </section>
  )
}

export default ClassesComp
