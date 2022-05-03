import { ReactChild, ReactFragment, ReactPortal, useState } from 'react'
import { useStopwatch } from 'react-timer-hook';
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'
import { collection, query, orderBy, addDoc, where } from 'firebase/firestore'
import { doc, getDoc } from "firebase/firestore";


interface TimerProp {
  totalDuration: number // in seconds, must be less than a day (86400 seconds).
  onExpire: () => void
}

function StopWatch(props: TimerProp) {
  // make sure duration is valid (between 0 and 86400, non-inclusive)
  if (props.totalDuration >= 86400) {
    throw new Error(
      `Cannot set timer for ${props.totalDuration} seconds because it's longer than a day (86400 seconds)`
    )
  } else if (props.totalDuration <= 0) {
    throw new Error(
      `Cannot set timer for ${props.totalDuration} seconds because it's negative or zero`
    )
  }

  //Stopwatch object
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  //user id (will be changed the the current logged in user once integrated)
  const userId = 'QpDjNV8TwCqg1hWNNtE5'

  //track start time
  const [startTime, setStart] = useState(new Date())

  //access the users enrolled classes
  const recordsRef = collection(db, 'users', userId, 'records')

  //save a record of study session
  async function addRecord() {
    let the_class: string
    let finishTime = new Date()
    if (currentClass === undefined) {
      the_class = classes[0]
    } else {
      the_class = currentClass
    }
    let ref: string = classMap.get(the_class)
    console.log(the_class)
    console.log(ref)
    await addDoc(recordsRef, {
      class: doc(db, 'classes', ref),
      class_name: the_class,
      start: startTime,
      finish: finishTime,
      duration: Math.round((finishTime.getTime() - startTime.getTime()) / 1000),
    })
  }

  //get names of all enrolled classes
  const userClassesRef = collection(db, 'users', userId, 'classes')
  const [value, loading, error] = useCollection(
    query(userClassesRef)
  )

  const docs = value?.docs
  let classes: string[] = []
  let classMap = new Map()
  if (docs !== undefined) {
    for (let i = 0; i < docs?.length; i++) {
      const jsonString: string = JSON.stringify(docs[i].data())
      const obj = JSON.parse(jsonString)
      classes.push(obj.name)
      classMap.set(obj.name, obj.id)
    }
  } 

  //Clean up timer display
  function formatTime(value: number): string {
    if (value === 0) {
      return '00'
    } else {
      return value.toString()
    }
  }

  //keep track of whether timer is running
  const [started, setStarted] = useState(false)

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
    startPauseResumeButton = <button onClickCapture={start} onClick={startTimer}>Start</button>
  } else if (isRunning) {
    // pause button showed
    startPauseResumeButton = <button onClick={pause}>Pause</button>
  } else {
    startPauseResumeButton = <button onClick={start}>Resume</button>
  }

  var minutesStudied = 0;

  //when log study time is pressed
  function logRecord() {
    addRecord()
    minutesStudied = (hours * 3600) + (minutes * 60) + seconds
  }

  //track currently selected class
  const [currentClass, setClass] = useState(classes[0])

  const handleSelect=(e: any)=>{
    setClass(e)
    console.log(currentClass);
  }

  function handleReset() {
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
      <span className="btn-purple">{<button onClickCapture={handleReset} onClick={logRecord}>Log Study Time</button>}</span>
      &nbsp;
      <span className="btn-purple">{<button onClickCapture={handleReset} onClick={reset}>Reset</button>}</span>
      &nbsp;
      <p>Current Class:</p>
      <select
      onChange = {(e) => handleSelect(e.target.value)}>
      {classes.map((c) => <option value={c}>{c}</option>)}
      </select>
    </div>
  )
}

export default StopWatch
