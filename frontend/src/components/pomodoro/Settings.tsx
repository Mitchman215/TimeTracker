import { useState } from 'react'
import Modal from 'react-modal'
import { IoMdSettings } from 'react-icons/io'
import { MdClose } from 'react-icons/md'
import { User } from './Pomodoro'
import TimeInput from './TimeInput'

// ensures background content is hidden for screen readers when settings is open
Modal.setAppElement('#root')

interface SettingsProp {
  user: User
  setUser: (newUser: User) => void
}

// default pomodoro workflow settings (change to match comments before final submission)
const defaultWork = 0.25 * 60 // 25 minutes
const defaultShortBreak = 0.1 * 60 // 5 minutes
const defaultLongBreak = 0.5 * 60 // 15 minutes
const defaultNumPoms = 2 // after this many work sessions are completed, take long break

// Component for the settings modal for the Pomodoro Timer.
// Allows the user to change the timer duration and other setting
function Settings(props: SettingsProp) {
  const [isOpen, setIsOpen] = useState(false)
  const [workTime, setWorkTime] = useState(props.user.pomWork)
  const [shortBreakTime, setShortBreakTime] = useState(props.user.pomShortBreak)
  const [longBreakTime, setLongBreakTime] = useState(props.user.pomLongBreak)

  // close the settings modal
  function closeSettings() {
    setIsOpen(false)
  }

  // saves the settings to the firestore database and updates the user data
  function saveSettings() {
    console.log('Saving settings')
    // TODO push changes to firestore
    if (workTime === undefined) {
      setWorkTime(defaultWork)
    }
    if (shortBreakTime === undefined) {
      setShortBreakTime(defaultShortBreak)
    }
    if (longBreakTime === undefined) {
      setLongBreakTime(defaultLongBreak)
    }
    props.setUser({
      ...props.user,
      pomWork: workTime! * 60,
      pomShortBreak: shortBreakTime! * 60,
      pomLongBreak: longBreakTime! * 60,
    })

    closeSettings()
  }

  return (
    <div>
      <button className="text-2xl" onClick={() => setIsOpen(true)}>
        <IoMdSettings />
      </button>
      <Modal isOpen={isOpen}>
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl text-bold">Settings</h2>
          <button className="text-2xl" onClick={closeSettings}>
            <MdClose />
          </button>
        </div>
        <h3 className="text-xl">Time settings (in minutes)</h3>
        <form className="flex flex-row justify-between">
          <TimeInput
            name="Work"
            value={workTime}
            setValue={setWorkTime}
            default={25}
          />
          <TimeInput
            name="Short Break"
            value={shortBreakTime}
            setValue={setShortBreakTime}
            default={5}
          />
          <TimeInput
            name="Long Break"
            value={longBreakTime}
            setValue={setLongBreakTime}
            default={15}
          />
        </form>

        <div className="flex mt-4">
          <button className="btn-purple" onClick={saveSettings}>
            Save and close
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Settings
