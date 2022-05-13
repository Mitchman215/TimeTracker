import { Stage as PomStage, Stage } from './Pomodoro'

export enum TimerState {
  NotStarted,
  Paused,
  Running,
  Finished,
}

interface Timer {
  seconds: number
  minutes: number
  hours: number
  state: TimerState
  start: () => void
  pause: () => void
  resume: () => void
  finish: () => void
  stop: () => void
}

interface TimerDisplayProp {
  timer: Timer
  pomStage?: PomStage // different color based on pom stage
}

// formats a number representing a time correctly
export function formatTime(time: number): string {
  if (time < 10) {
    return '0' + time.toString()
  } else {
    return time.toString()
  }
}

// stateless component that displays a timer object
export default function TimerDisplay({ timer, pomStage }: TimerDisplayProp) {
  const timerDisplayString = `${formatTime(timer.hours)}:${formatTime(
    timer.minutes
  )}:${formatTime(timer.seconds)}`

  let timeDisplay: JSX.Element
  switch (pomStage) {
    case Stage.ShortBreak:
      timeDisplay = (
        <div className="bg-blue-medium time-display" id="time">
          {timerDisplayString}
        </div>
      )
      break
    case Stage.LongBreak:
      timeDisplay = (
        <div className="bg-blue-dark time-display" id="time">
          {timerDisplayString}
        </div>
      )
      break
    default:
      timeDisplay = (
        <div className="bg-orange-medium time-display" id="time">
          {timerDisplayString}
        </div>
      )
      break
  }

  let startPauseResumeButton: JSX.Element
  switch (timer.state) {
    case TimerState.NotStarted:
      // show start button
      startPauseResumeButton = (
        <button className="btn-purple" onClick={timer.start} id="start-button">
          Start
        </button>
      )
      break
    case TimerState.Running:
      // show pause button
      startPauseResumeButton = (
        <button className="btn-purple" onClick={timer.pause} id="pause-button">
          Pause
        </button>
      )
      break
    case TimerState.Paused:
      // show resume button
      startPauseResumeButton = (
        <button
          className="btn-purple"
          onClick={timer.resume}
          id="resume-button"
        >
          Resume
        </button>
      )
      break
    case TimerState.Finished:
      // show no button
      startPauseResumeButton = <></>
      break
  }

  const finishButton = (
    <button
      hidden={timer.state === TimerState.NotStarted}
      onClick={timer.finish}
      className="btn-purple"
      id="finish-button"
    >
      Finish Early
    </button>
  )

  async function onStopClick() {
    const initialState: TimerState = timer.state
    // confirmation dialog to make sure user wants to stop
    timer.pause()
    const stop = await confirm(
      'Stopping the Pomodoro Timer will lose all unfinished study progress.'
    )
    if (stop) {
      timer.stop()
    } else if (initialState !== TimerState.Paused) {
      timer.resume()
    }
  }

  const stopButton = (
    <button
      hidden={timer.state === TimerState.NotStarted}
      onClick={onStopClick}
      className="btn-purple"
      id="stop-button"
    >
      Stop
    </button>
  )

  return (
    <div className="bg-orange-light flex flex-col items-center p-2 mb-2 rounded-md">
      {timeDisplay}
      <span>
        {startPauseResumeButton}
        {finishButton}
        {stopButton}
      </span>
    </div>
  )
}
