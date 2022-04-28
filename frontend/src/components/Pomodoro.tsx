import React, { useState } from 'react'
import TimerComponent from './TimerComponent'

interface PomodoroProp {
  user: {
    pomWork?: number // user's last set work duration
    pomShortBreak?: number // user's last set short break duration
    pomLongBreak?: number // user's last set long break duration
  }
}

// make sure a given duration is between 0 and 86400 seconds if it's defined.
// otherwise, return a default value
function verifyDuration(
  duration: number | undefined | null,
  defaultDuration: number
): number {
  if (!duration || duration < 0 || duration >= 86400) {
    return defaultDuration
  } else {
    return duration
  }
}

// the possible stages of the pomodoro
enum Stage {
  NotStarted,
  Work,
  ShortBreak,
  LongBreak,
}

// default pomodoro workflow settings
const defaultWork = (1 / 5) * 60 // 25 minutes
const defaultShortBreak = 0.1 * 60 // 5 minutes
const defaultLongBreak = 0.5 * 60 // 15 minutes
const numPomsInSet = 2 // after this many work sessions are completed, take long break

function Pomodoro(props: PomodoroProp) {
  const workDuration = verifyDuration(props.user.pomWork, defaultWork)
  const shortBreak = verifyDuration(props.user.pomShortBreak, defaultShortBreak)
  const longBreak = verifyDuration(props.user.pomLongBreak, defaultLongBreak)

  const [curStage, setStage] = useState<Stage>(Stage.NotStarted)
  const [pomsFinished, setPomsFinished] = useState(0)

  function onWorkFinish() {
    console.log('Finished work session!')
    setPomsFinished(pomsFinished + 1)
    if (pomsFinished >= numPomsInSet) {
      // user has finished set of pomodoros, take a long break
      setStage(Stage.LongBreak)
      setPomsFinished(0)
    } else {
      // user not done with set yet, take short break
      setStage(Stage.ShortBreak)
    }
  }

  function onShortBreakFinish() {
    console.log('Short break done!')
    setStage(Stage.Work)
  }

  function onLongBreakFinish() {
    console.log('Long break done!')
    setStage(Stage.NotStarted)
  }

  let titleString = 'loading'
  let timer: JSX.Element
  switch (curStage) {
    case Stage.ShortBreak:
      titleString = 'Nice! Time for a short break'
      timer = (
        <TimerComponent
          totalDuration={shortBreak}
          onExpire={onShortBreakFinish}
          autoStart={true}
        />
      )
      break
    case Stage.LongBreak:
      titleString = 'Good job! Time for a long break'
      timer = (
        <TimerComponent
          totalDuration={longBreak}
          onExpire={onLongBreakFinish}
          autoStart={true}
        />
      )
      break
    default:
      titleString = 'Time to grind'
      timer = (
        <TimerComponent
          totalDuration={workDuration}
          onExpire={onWorkFinish}
          autoStart={false}
          onStart={() => setStage(Stage.Work)}
        />
      )
  }

  return (
    <div className="flex flex-col items-center">
      <span className="flex flex-row items-center bg-orange-light text-white font-semibold">
        <h2 className="px-2 text-2xl">{titleString}</h2>
        <h3 className="px-2 text-xl">#Poms: {pomsFinished}</h3>
      </span>
      {timer}
    </div>
  )
}

export default Pomodoro
