import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { Ok, Err, Result } from 'ts-results'

// TODO: expand to contain all departments
const validDepartmentCodes = ['CSCI', 'MATH', 'MCM', 'EDUC', 'APMA']

// determine if a code represents a department at Brown
function isValidDepartment(code: string): boolean {
  return validDepartmentCodes.includes(code)
}

/**
 * Determines if the specified string is a valid course number
 * with format "XXXX[L]" where X is a digit and [L] is an optional letter
 * @param num the course number as a string
 * @returns true if `num` is a valid course number, false otherwise
 */
function isValidCourseNumber(num: string): boolean {
  const regex = /^\d{4}[A-Z]?$/
  return regex.test(num)
}

/**
 * Tries to add a new class to the firestore database,
 * initializing averages and total time to 0
 * @param department   the department code (Ex: CSCI)
 * @param courseNumber the course number (Ex: 0320)
 * @param name         the name of the course
 * @returns a result with the new class's id if it succeeds, or an error if it fails.
 * Reasons for failing include invalid args or the class already exists.
 */
export async function addNewClass(
  department: string,
  courseNumber: string,
  name: string
): Promise<Result<string, Error>> {
  department = department.toUpperCase().trim()
  courseNumber = courseNumber.toUpperCase().trim()
  name = name.trim()
  // check args are validly formatted
  if (!isValidDepartment(department)) {
    return Err(new Error(`"${department}" is not a valid department code`))
  } else if (!isValidCourseNumber(courseNumber)) {
    return Err(new Error(`"${courseNumber}" is not a valid course number`))
  } else {
    const newClassId = department + ' ' + courseNumber
    const newClassRef = doc(db, 'classes', newClassId)
    // check if class with the same id already exists
    const oldClass = await getDoc(newClassRef)
    if (oldClass.exists()) {
      return Err(new Error(`Class with id "${newClassId}" already exists`))
    }
    // create the new class doc in the global 'classes' collection
    await setDoc(newClassRef, {
      daily_average: '0',
      department: department,
      course_number: courseNumber,
      name: name,
      total_time: '0',
      weekly_average: '0',
    })
    return Ok(newClassId)
  }
}
