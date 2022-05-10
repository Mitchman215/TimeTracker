import { useEffect, useState } from 'react'
import { useTimer } from 'react-timer-hook'
import usePrompt from '../../../hooks/usePrompt'
import User from '../../../models/User'
import Settings from './Settings'
import TimerDisplay, { TimerState } from './TimerDisplay'

export interface PomodoroProp {
  user: User
  currentClass: string
  currentAssignment: string
}

// the possible stages of the pomodoro
export enum Stage {
  NotStarted,
  Work,
  ShortBreak,
  LongBreak,
}

const defaultNumPoms = 2 // after this many work sessions are completed, take long break

function Pomodoro(props: PomodoroProp) {
  const [curStage, setStage] = useState<Stage>(Stage.NotStarted)
  const [startTime, setStartTime] = useState<Date>()
  const [pomsFinished, setPomsFinished] = useState(0)

  function finishStage(stage: Stage, studyTime: number) {
    switch (stage) {
      case Stage.Work:
        // when work timer finishes, incremenent the pom # and advance to either short break or long break
        console.log(`Finished work session! Studied for ${studyTime} seconds.`)
        let start: Date
        if (startTime === undefined) {
          // if startTime is undefined, set start to 25 minutes ago
          const curDate = new Date()
          start = new Date(curDate.getTime() - studyTime * 1000)
        } else {
          start = startTime
        }
        // log the study session in firebase
        props.user.logRecord(props.currentClass, start, studyTime)
        if (pomsFinished + 1 >= defaultNumPoms) {
          // user has finished set of pomodoros, take a long break
          setStage(Stage.LongBreak)
          setPomsFinished(0)
        } else {
          // user not done with set yet, take short break
          setStage(Stage.ShortBreak)
        }
        // increment the poms finished
        setPomsFinished(pomsFinished + 1)
        break
      case Stage.ShortBreak:
        // when short break timer finishes, advance to work stage
        console.log('Short break done!')
        setStage(Stage.Work)
        setStartTime(new Date())
        break
      case Stage.LongBreak:
        // when long break timer finishes, reset to not started stage
        console.log('Long break done!')
        setStage(Stage.NotStarted)
        setStartTime(new Date())
        break
      case Stage.NotStarted:
        console.error(`Can't end the pomodoro timer without starting it`)
    }
  }

  let duration: number
  let titleString: string
  switch (curStage) {
    case Stage.NotStarted:
      titleString = `Click the start button to begin`
      duration = props.user.pomSettings.workDuration
      break
    case Stage.Work:
      titleString = `Time to grind. Working on ${props.currentClass}`
      duration = props.user.pomSettings.workDuration
      break
    case Stage.ShortBreak:
      titleString = 'Nice! Take a short break'
      duration = props.user.pomSettings.shortBreakDuration
      break
    case Stage.LongBreak:
      titleString = 'Good job! Take a long break, you deserve it'
      duration = props.user.pomSettings.longBreakDuration
  }
  const onTimerFinish = () => finishStage(curStage, duration)

  // returns a date object representing when the timer should expire
  function getExpireTime(): Date {
    const time = new Date()
    time.setSeconds(time.getSeconds() + duration)
    return time
  }

  const timerHook = useTimer({
    expiryTimestamp: getExpireTime(),
    autoStart: curStage !== Stage.NotStarted,
    onExpire: onTimerFinish,
  })

  // workaround to get timer to restart everytime the stage changes
  useEffect(() => {
    timerHook.restart(getExpireTime(), curStage !== Stage.NotStarted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curStage, props.user])

  // returns the current timer state
  function getTimerState(): TimerState {
    if (curStage === Stage.NotStarted) {
      return TimerState.NotStarted
    } else if (timerHook.isRunning) {
      return TimerState.Running
    } else {
      return TimerState.Paused
    }
  }

  // method to call when the user starts the timer
  let onStart: () => void
  if (curStage === Stage.NotStarted) {
    onStart = () => {
      console.log('Starting timer!')
      setStage(Stage.Work)
      setStartTime(new Date())
      timerHook.start()
    }
  } else {
    onStart = timerHook.start
  }

  // method called when the user chooses to finsih a stage early
  function finishEarly() {
    console.log(`Finishing current stage early`)
    const timeLeft =
      timerHook.seconds + 60 * timerHook.minutes + 3600 * timerHook.hours
    const studyTime = duration - timeLeft
    finishStage(curStage, studyTime)
  }

  function stopPom() {
    console.log('Stopping pomodoro timer')
    timerHook.restart(getExpireTime(), false)
    // reset all state
    setStage(Stage.NotStarted)
    setStartTime(undefined)
    setPomsFinished(0)
  }

  const timer = {
    ...timerHook,
    start: onStart,
    finish: finishEarly,
    stop: stopPom,
    state: getTimerState(),
  }

  // when the user tries to navigate away, if the timer is running, ask them to confirm
  usePrompt(
    'Are you sure you want to leave without logging your time?',
    timer.state === TimerState.Running || timer.state === TimerState.Paused
  )

  return (
    <div className="flex flex-col items-center">
      <span className="flex flex-row items-center bg-orange-light text-white font-semibold">
        <h2 className="px-2 text-2xl mt-2">{titleString}</h2>
        <h3 className="px-2 text-xl text-neutral-100">#Poms: {pomsFinished}</h3>
        {curStage === Stage.NotStarted && <Settings user={props.user} />}
      </span>
      <TimerDisplay timer={timer} pomStage={curStage} />
    </div>
  )
}

export default Pomodoro
