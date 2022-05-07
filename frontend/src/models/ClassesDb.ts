import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

// determine if a code represents a department at Brown
// might make sense to move this function somewhere else
function isValidDepartmentCode(code: string) {
  // TODO: include all valid brown subject / department codes
  const validCodes = ['CSCI', 'MATH', 'MCM', 'EDUC', 'APMA']
  return validCodes.includes(code)
}

// adds a new class to the database
export async function addNewClass(
  department: string,
  courseNumber: string,
  name: string
) {
  // check args are validly formatted
  if (isValidDepartmentCode(department)) {
    const newClassId = department + ' ' + courseNumber
    await setDoc(doc(db, 'classes', newClassId), {
      daily_average: '0',
      department: department,
      name: name,
      total_time: '0',
      weekly_average: '0',
    })
  }
}
