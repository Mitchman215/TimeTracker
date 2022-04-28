import { useState } from 'react'
import { useTimer } from 'react-timer-hook'

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

function TimerComponent(props: TimerProp) {
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

  const time = new Date()
  // time represents when the timer should end
  time.setSeconds(time.getSeconds() + props.totalDuration)

  // hook for timer information
  const timer: Timer = useTimer({
    expiryTimestamp: time,
    autoStart: false,
    onExpire: props.onExpire,
  })

  // state for whether the user has started the timer
  const [started, setStarted] = useState(false)
  function startTimer() {
    timer.start()
    setStarted(true)
  }

  let startPauseResumeButton: JSX.Element
  if (!started) {
    // start button showed
    startPauseResumeButton = <button onClick={startTimer}>Start</button>
  } else if (timer.isRunning) {
    // pause button showed
    startPauseResumeButton = <button onClick={timer.pause}>Pause</button>
  } else {
    startPauseResumeButton = <button onClick={timer.resume}>Resume</button>
  }

  function formatTime(value: number): string {
    if (value === 0) {
      return '00'
    } else {
      return value.toString()
    }
  }

  // eslint-disable-next-line prettier/prettier
  const timerDisplayString = 
    `${formatTime(timer.hours)}:${formatTime(timer.minutes)}:${formatTime(timer.seconds)}`

  return (
    <div className="bg-orange-light flex flex-col items-center p-4 rounded-md">
      <div className="bg-orange-medium text-8xl p-4 m-2 rounded-md shadow-md">
        {timerDisplayString}
      </div>
      <span className="btn-purple">{startPauseResumeButton}</span>
    </div>
  )
}

export default TimerComponent
