import { useState } from 'react'
import { useStopwatch } from 'react-timer-hook'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase'
import { collection, query, addDoc } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { formatTime } from './pomodoro/TimerDisplay'
import { UserProp } from '../../models/User'

//enrolled classes must have a name field and an id field that matches their reference id

function StopWatch(props: UserProp) {
  //Stopwatch object
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false })

  //user id (will be changed the the current logged in user once integrated)
  const userId = props.user.uid

  //track start time
  const [startTime, setStart] = useState(new Date())

  //access the users enrolled classes
  const recordsRef = collection(db, 'users', userId, 'records')

  //get names of all enrolled classes
  const userClassesRef = collection(db, 'users', userId, 'classes')
  const [value, loading, error] = useCollection(query(userClassesRef))

  const docs = value?.docs
  const classes: string[] = []
  const classMap = new Map()
  if (docs !== undefined) {
    for (let i = 0; i < docs?.length; i++) {
      const jsonString: string = JSON.stringify(docs[i].data())
      const obj = JSON.parse(jsonString)
      classes.push(obj.name)
      classMap.set(obj.name, obj.id)
    }
  }

  //keep track of whether timer is running
  const [started, setStarted] = useState(false)

  //track currently selected class
  const [currentClass, setClass] = useState(classes[0])

  //when stopwatch starts
  function startTimer() {
    console.log(currentClass)
    setStart(new Date())
    setStarted(true)
  }

  //text on button is either start, pause, or resume depending on state of stopwatch
  let startPauseResumeButton: JSX.Element
  if (!started) {
    // start button showed
    startPauseResumeButton = (
      <button onClickCapture={start} onClick={startTimer}>
        Start
      </button>
    )
  } else if (isRunning) {
    // pause button showed
    startPauseResumeButton = <button onClick={pause}>Pause</button>
  } else {
    startPauseResumeButton = <button onClick={start}>Resume</button>
  }

  //save a record of study session
  async function addRecord() {
    let theClass: string
    const finishTime = new Date()
    if (currentClass === undefined) {
      theClass = classes[0]
    } else {
      theClass = currentClass
    }
    const ref: string = classMap.get(theClass)
    console.log(theClass)
    console.log(ref)
    await addDoc(recordsRef, {
      class: doc(db, 'classes', ref),
      class_name: theClass,
      start: startTime,
      finish: finishTime,
      duration: hours * 3600 + minutes * 60 + seconds,
    })
  }

  //when log study time is pressed
  function logRecord() {
    addRecord()
    reset(undefined, false)
    setStarted(false)
  }

  const handleSelect = (e: any) => {
    setClass(e)
    console.log(currentClass)
  }

  function handleReset() {
    reset(undefined, false)
    setStarted(false)
  }

  // eslint-disable-next-line prettier/prettier
  const timerDisplayString = 
    `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`

  return (
    <div className="bg-orange-light flex flex-col items-center p-4 rounded-md">
      <div className="bg-orange-medium text-8xl p-4 m-2 rounded-md shadow-md">
        {timerDisplayString}
      </div>
      <span className="btn-purple">{startPauseResumeButton}</span>
      &nbsp;
      <span className="btn-purple">
        {<button onClick={logRecord}>Log Study Time</button>}
      </span>
      &nbsp;
      <span className="btn-purple">
        {<button onClick={handleReset}>Reset</button>}
      </span>
      &nbsp;
      <p>Current Class:</p>
      <select onChange={(e) => handleSelect(e.target.value)}>
        {classes.map((c) => (
          <option value={c} key={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )
}

export default StopWatch
