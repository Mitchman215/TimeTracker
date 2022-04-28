import { useState } from 'react'
import { useTimer } from 'react-timer-hook'
import { useStopwatch } from 'react-timer-hook';

interface TimerProp {
  totalDuration: number // in seconds, must be less than a day (86400 seconds).
  onExpire: () => void
}

// Timer object returned by useTimer hook
interface Timer {
  seconds: number
  minutes: number
  hours: number
  days: number
  isRunning: boolean
  start: () => void
  pause: () => void
  resume: () => void
  restart: (newExpiryTimestamp: Date, autoStart?: boolean | undefined) => void
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

  function formatTime(value: number): string {
    if (value === 0) {
      return '00'
    } else {
      return value.toString()
    }
  }

  const [started, setStarted] = useState(false)
  function startTimer() {
    start
    setStarted(true)
  }

  let startPauseResumeButton: JSX.Element
  if (!started) {
    // start button showed
    startPauseResumeButton = <button onClick={startTimer}>Start</button>
  } else if (isRunning) {
    // pause button showed
    startPauseResumeButton = <button onClick={pause}>Pause</button>
  } else {
    startPauseResumeButton = <button onClick={start}>Resume</button>
  }

  function logRecord() {
    //TODO: import Stuart's function
    reset
    let minutesStudied: number = hours * 60 + minutes
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
      <span className="btn-purple">{<button onClick={logRecord}>Log Study Time</button>}</span>
      &nbsp;
      <select>
      <option value="32">Cs32</option>
      <option value="19">Cs19</option>
      <option value="2020">CSCI 1010</option>
      </select>
    </div>
  )
}

export default StopWatch
