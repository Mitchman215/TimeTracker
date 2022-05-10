import { query } from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import UserContext from '../../models/UserContext'
import ErrorPage from '../ErrorPage'
import Pomodoro from './pomodoro/Pomodoro'
import StopWatch from './StopWatch'

// returns an individual dropdown option for some value with a toString method
function optionFor(val: { toString: () => string }) {
  return (
    <option value={val.toString()} key={val.toString()}>
      {val.toString()}
    </option>
  )
}

// Component for tracking time, either via the stopwatch or pomodoro timer
function TimeTracker() {
  // get the user from the context
  const user = useContext(UserContext)
  if (user === null) {
    throw new Error('No user logged in')
  }

  // get all of the user's classes from firebase
  const [allClasses, loadingClasses, classesError] = useCollectionData(
    query(user.typedClassesRef)
  )

  // an array of the user's classes' ids
  const [classIds, setClassIds] = useState<string[]>()
  useEffect(() => {
    setClassIds(allClasses?.map((c) => c.id))
  }, [allClasses])

  // track currently selected class
  const [curClass, setClass] = useState<string>()

  // once classIds is loaded, selects the first class automatically
  useEffect(() => {
    if (classIds && curClass === undefined) {
      setClass(classIds[0])
    }
  }, [classIds, curClass])

  // track currently specified assignment
  const [curAssignment, setAssignment] = useState('')

  // the available time tracking modes
  enum Mode {
    PomTimer = 'Pomodoro Timer',
    Stopwatch = 'Stopwatch',
  }
  // which time tracking mode is currently chosen
  const [curMode, setMode] = useState<Mode>(Mode.Stopwatch)

  if (allClasses?.length === 0 && !loadingClasses) {
    let msg: string | Error
    if (classesError) {
      msg = classesError
    } else {
      msg = `You do not have any classes. 
        Please add some classes from the home page before using the timer or stopwatch.`
    }
    return <ErrorPage error={msg} />
  }

  // handles selecting a tracking mode from the dropdown
  function handleModeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    switch (e.target.value) {
      case 'Pomodoro Timer':
        setMode(Mode.PomTimer)
        break
      case 'Stopwatch':
        setMode(Mode.Stopwatch)
        break
    }
  }

  // the dropdown for selecting a time tracking mode
  const modeSelector = (
    <select
      className="text-2xl p-1 rounded-sm font-semibold shadow-md"
      onChange={handleModeSelect}
    >
      {optionFor(Mode.Stopwatch)}
      {optionFor(Mode.PomTimer)}
    </select>
  )

  // the current mode's time tracking component ui
  let selectedTracker: JSX.Element
  if (curClass === undefined) {
    selectedTracker = <></>
  } else {
    switch (curMode) {
      case Mode.PomTimer:
        selectedTracker = (
          <Pomodoro
            currentClass={curClass}
            currentAssignment={curAssignment}
            user={user}
          />
        )
        break
      case Mode.Stopwatch:
        selectedTracker = (
          <StopWatch
            currentClass={curClass}
            currentAssignment={curAssignment}
          />
        )
        break
    }
  }

  // to be called when classSelector dropdown changes
  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClass(e.target.value)
    console.log(`changing class to ${e.target.value}`)
  }
  // dropdown for choosing which class is currently being studied for
  const classSelector = (
    <div className="flex flex-col mx-2">
      <p>Current Class</p>
      <select onChange={handleClassSelect}>
        {classIds?.map((c) => (
          <option value={c} key={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="flex flex-col justify-center items-center bg-orange-light px-2 py-8 max-w-4xl grow">
      {modeSelector}
      {selectedTracker}
      <div className="flex mt-2">
        {classSelector}
        <input
          type="text"
          name="assignment"
          placeholder="Enter Assignment name here"
          value={curAssignment}
          onChange={(e) => setAssignment(e.target.value)}
        />
      </div>
    </div>
  )
}

export default TimeTracker
