import { addDoc, collection, doc, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase'
import { getCurrentUser, UserProp } from '../../models/User'
import Pomodoro from './pomodoro/Pomodoro'
import StopWatch from './StopWatch'

// props that will be passed to the different modes of time tracking
interface TrackerProp {
  // should be called whenever the time tracker starts
  setStartTime: (startTime: Date | undefined) => void
  // should be updated every time the time tracker increments
  setTimeStudied: (timeStudied: number) => void
}

// Component for tracking time, either via the stopwatch or pomodoro timer
function TimeTracker(props: UserProp) {
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

  // when the user started studying. Is undefined if user hasn't started
  const [startTime, setStartTime] = useState<Date>()

  // how long the user has been studying for in seconds
  const [timeStudied, setTimeStudied] = useState(0)

  // the current mode's time tracking component ui
  let selectedTracker: JSX.Element
  switch (curMode) {
    case Mode.PomTimer:
      selectedTracker = <Pomodoro user={{}} />
      break
    case Mode.Stopwatch:
      selectedTracker = <StopWatch />
      break
  }

  // // maybe change around following lines so user data is passed in as opposed to queried numerous times
  // //user id (will be changed the the current logged in user once integrated)
  // const userId = 'QpDjNV8TwCqg1hWNNtE5'
  // // get a reference to the users' existing time records
  // const recordsRef = collection(db, 'users', userId, 'records')

  // //get names of all enrolled classes
  // const userClassesRef = collection(db, 'users', userId, 'classes')
  // const [value, loading, error] = useCollection(query(userClassesRef))

  // const docs = value?.docs
  // const classes: string[] = []
  // const classMap = new Map()
  // if (docs !== undefined) {
  //   for (let i = 0; i < docs?.length; i++) {
  //     const jsonString: string = JSON.stringify(docs[i].data())
  //     const obj = JSON.parse(jsonString)
  //     classes.push(obj.name)
  //     classMap.set(obj.name, obj.id)
  //   }
  // }

  const [allClasses, setAllClasses] = useState<string[]>([])

  // gets and sets the current user's classes when this component first renders
  useEffect(() => {
    props.user.getClasses().then((classes) => setAllClasses(classes))
  }, [props.user])

  //track currently selected class
  const [currentClass, setClass] = useState(allClasses[0])

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClass(e.target.value)
    console.log(currentClass)
  }

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

  //when log study time is pressed
  function logRecord() {
    if (startTime !== undefined) {
      props.user.logRecord(currentClass, startTime, timeStudied)
    } else {
      console.log("Study session has not started, can't log it")
    }
    // reset(undefined, false)
    // setStarted(false)
  }

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
        />
        <button className="btn-purple" onClick={logRecord}>
          Log Study Time
        </button>
      </div>
    </div>
  )
}

export default TimeTracker
