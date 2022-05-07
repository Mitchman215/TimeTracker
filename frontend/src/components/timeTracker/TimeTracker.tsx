import { useContext, useEffect, useState } from 'react'
import UserContext from '../../models/UserContext'
import Pomodoro from './pomodoro/Pomodoro'
import StopWatch from './StopWatch'

// Component for tracking time, either via the stopwatch or pomodoro timer
function TimeTracker() {
  // get the user from the context
  const user = useContext(UserContext)
  if (user === null) {
    throw new Error('No user logged in')
  }

  // state that controls which classes the user can study for
  const [allClasses, setAllClasses] = useState<string[]>([])

  // gets and sets the current user's classes when this component first renders
  useEffect(() => {
    user.getClasses().then((classes) => setAllClasses(classes))
  }, [user])

  // track currently selected class
  const [curClass, setClass] = useState(allClasses[0])

  // track currently selected assignment
  const [curAssignment, setAssignment] = useState('')

  // to be called when classSelector dropdown changes
  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClass(e.target.value)
    console.log(curClass)
  }

  // the available time tracking modes
  enum Mode {
    PomTimer = 'Pomodoro Timer',
    Stopwatch = 'Stopwatch',
  }
  // which time tracking mode is currently chosen
  const [curMode, setMode] = useState<Mode>(Mode.Stopwatch)

  // returns an individual dropdown option for some value with a toString method
  function optionFor(val: { toString: () => string }) {
    return (
      <option value={val.toString()} key={val.toString()}>
        {val.toString()}
      </option>
    )
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
    <select className="ml-auto" onChange={handleModeSelect}>
      {optionFor(Mode.Stopwatch)}
      {optionFor(Mode.PomTimer)}
    </select>
  )

  // the current mode's time tracking component ui
  let selectedTracker: JSX.Element
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
        <StopWatch currentClass={curClass} currentAssignment={curAssignment} />
      )
      break
  }

  // dropdown for choosing which class is currently being studied for
  const classSelector = (
    <div className="flex flex-col mx-2">
      <p>Current Class</p>
      <select onChange={handleClassSelect}>
        {allClasses.map((c) => (
          <option value={c} key={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="flex flex-col justify-center items-center bg-orange-light p-4">
      <span className="bg-blue-medium flex justify-center items-center p-1 rounded-sm">
        <h2 className="text-3xl mr-2">{curMode}</h2>
        {modeSelector}
      </span>
      {selectedTracker}
      <div className="flex">
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
