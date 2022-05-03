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
  restart: () => void
}

interface TimerDisplayProp {
  timer: Timer
  displayBgColor?: string // tailwind-css color name that dictates the color behind the display time
}

// stateless component that displays a timer object
export default function TimerDisplay(props: TimerDisplayProp) {
  // formats a number representing a time correctly
  function formatTime(value: number): string {
    if (value < 10) {
      return '0' + value.toString()
    } else {
      return value.toString()
    }
  }

  const timerDisplayString = `${formatTime(props.timer.hours)}:${formatTime(
    props.timer.minutes
  )}:${formatTime(props.timer.seconds)}`

  let startPauseResumeButton: JSX.Element
  switch (props.timer.state) {
    case TimerState.NotStarted:
      // show start button
      startPauseResumeButton = (
        <button className="btn-purple" onClick={props.timer.start}>
          Start
        </button>
      )
      break
    case TimerState.Running:
      // show pause button
      startPauseResumeButton = (
        <button className="btn-purple" onClick={props.timer.pause}>
          Pause
        </button>
      )
      break
    case TimerState.Paused:
      // show resume button
      startPauseResumeButton = (
        <button className="btn-purple" onClick={props.timer.resume}>
          Resume
        </button>
      )
      break
    case TimerState.Finished:
      // show no button
      startPauseResumeButton = <></>
      break
  }

  const restartButton = (
    <button
      hidden={props.timer.state === TimerState.NotStarted}
      onClick={props.timer.restart}
      className="btn-purple"
    >
      Restart
    </button>
  )

  return (
    <div className="bg-orange-light flex flex-col items-center p-4 rounded-md">
      <div
        className={`bg-orange-medium text-8xl p-4 m-2 rounded-md shadow-md bg-${props.displayBgColor}`}
      >
        {timerDisplayString}
      </div>
      <span>
        {startPauseResumeButton}
        {restartButton}
      </span>
    </div>
  )
}
