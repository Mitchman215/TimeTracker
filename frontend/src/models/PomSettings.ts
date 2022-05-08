// object that encapsulates a user's pomodoro timer settings
export interface PomSettings {
  // all durations represent a time in seconds, and should be positive numbers less than 86400 (1 day)
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  pomsPerSet: number // should be non-negative
}

// TODO: change to false after done testing
// controls whether the default pom settings are in testing mode or not.
// testing mode has shorter durations (15s, 6s, 12s)
const testing = false

// default pomodoro workflow settings
const defaultWork = (testing ? 0.25 : 25) * 60 // 25 minutes in production mode
const defaultShortBreak = (testing ? 0.1 : 5) * 60 // 5 minutes in production mode
const defaultLongBreak = (testing ? 0.2 : 15) * 60 // 15 minutes in production mode
const defaultNumPoms = testing ? 2 : 4 // after this many work sessions are completed, take long break
export const defaultPomSettings = {
  workDuration: defaultWork,
  shortBreakDuration: defaultShortBreak,
  longBreakDuration: defaultLongBreak,
  pomsPerSet: defaultNumPoms,
}
