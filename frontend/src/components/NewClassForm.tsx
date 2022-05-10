import { FormEvent, useState } from 'react'
import { addNewClass } from '../models/ClassesDb'

// type for a status message
interface Status {
  message: string
  isError: boolean
}

function NewClassForm() {
  // state variables for a new class and its department inputted by the user
  const [newClassDepartment, setNewClassDepartment] = useState('')
  const [newClassNum, setNewClassNum] = useState('')
  const [newClassName, setNewClassName] = useState('')

  // message to tell the user the result of trying to add the new class
  const [newClassStatus, setNewClassStatus] = useState<Status>({
    message: '',
    isError: false,
  })
  const statusDisplay = newClassStatus.isError ? (
    <p className="text-red-error">{newClassStatus.message}</p>
  ) : (
    <p className="text-green-success">{newClassStatus.message}</p>
  )

  // handles when the user clicks the button to add a new class
  async function addClass(event: FormEvent) {
    event.preventDefault()
    // check to make sure none of the input fields are empty
    if (newClassDepartment && newClassNum && newClassName) {
      // all fields are non-empty
      // try to add new class
      const result = await addNewClass(
        newClassDepartment,
        newClassNum,
        newClassName
      )
      if (result.ok) {
        // adding new class succeeded
        setNewClassStatus({
          message: `Successfully created a class with id "${result.val}"`,
          isError: false,
        })

        setNewClassDepartment('')
        setNewClassNum('')
        setNewClassName('')
      } else {
        // adding new class failed
        console.log({ error: result.val })
        setNewClassStatus({
          message: `Couldn't add that class: ${result.val.message}`,
          isError: true,
        })
      }
    } else {
      setNewClassStatus({
        message: 'Please fill out each field before adding a new class',
        isError: true,
      })
    }
  }
  return (
    <form>
      <span className="flex flex-row my-2">
        <label className="flex flex-col mr-4 underline">
          Department
          <input
            className="w-20"
            value={newClassDepartment}
            placeholder="Ex. CSCI"
            onChange={(e) => setNewClassDepartment(e.target.value)}
          />
        </label>
        <label className="flex flex-col underline">
          Number
          <input
            className="w-20"
            value={newClassNum}
            placeholder="Ex. 0320"
            onChange={(e) => setNewClassNum(e.target.value)}
          />
        </label>
      </span>
      <label className="flex flex-col my-2 underline">
        Class name
        <input
          value={newClassName}
          placeholder="Ex. Introduction to Software Engineering"
          onChange={(e) => setNewClassName(e.target.value)}
        />
      </label>
      <button className="btn-blue my-2" onClick={addClass}>
        Submit
      </button>
      {statusDisplay}
    </form>
  )
}

export default NewClassForm
