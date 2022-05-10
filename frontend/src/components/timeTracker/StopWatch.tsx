import { useContext, useState } from 'react'
import { useStopwatch } from 'react-timer-hook'
import { formatTime } from './pomodoro/TimerDisplay'
import UserContext from '../../models/UserContext'

interface StopWatchProps {
  currentClass: string
  currentAssignment: string
}

function StopWatch({ currentClass }: StopWatchProps) {
  // get the user from the context
  const user = useContext(UserContext)
  if (user === null) {
    throw new Error('No user logged in')
  }

  //Stopwatch object
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false })

  //track start time
  const [startTime, setStart] = useState(new Date())

  //keep track of whether timer is running
  const [started, setStarted] = useState(false)

  //when stopwatch starts
  function startTimer() {
    setStart(new Date())
    setStarted(true)
  }

  //text on button is either start, pause, or resume depending on state of stopwatch
  let startPauseResumeButton: JSX.Element
  if (!started) {
    // start button showed
    startPauseResumeButton = (
      <button
        className="btn-purple"
        onClickCapture={start}
        onClick={startTimer}
      >
        Start
      </button>
    )
  } else if (isRunning) {
    // pause button showed
    startPauseResumeButton = (
      <button className="btn-purple" onClick={pause}>
        Pause
      </button>
    )
  } else {
    startPauseResumeButton = (
      <button className="btn-purple" onClick={start}>
        Resume
      </button>
    )
  }

  //when log study time is pressed
  function logRecord() {
    const timeStudied = seconds + 60 * minutes + 3600 * hours
    user?.logRecord(currentClass, startTime, timeStudied)
    reset(undefined, false)
    setStarted(false)
  }

  function handleReset() {
    reset(undefined, false)
    setStarted(false)
  }

  // eslint-disable-next-line prettier/prettier
  const timerDisplayString = 
    `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`

  return (
    <div className="bg-orange-light flex flex-col items-center p-2 mb-2 rounded-md">
      <div className="bg-orange-medium time-display">{timerDisplayString}</div>
      <span>
        {startPauseResumeButton}
        <button className="btn-purple" onClick={logRecord}>
          Log Study Time
        </button>
        <button className="btn-purple" onClick={handleReset}>
          Reset
        </button>
      </span>
    </div>
  )
}

export default StopWatch
