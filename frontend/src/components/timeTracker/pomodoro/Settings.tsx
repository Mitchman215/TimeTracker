import { useState } from 'react'
import Modal from 'react-modal'
import { IoMdSettings } from 'react-icons/io'
import { MdClose } from 'react-icons/md'
import TimeInput from './TimeInput'
import User from '../../../models/User'
import { defaultPomSettings, PomSettings } from '../../../models/PomSettings'

// ensures background content is hidden for screen readers when settings is open
Modal.setAppElement('#root')

interface SettingsProp {
  user: User
}

// Component for the settings modal for the Pomodoro Timer.
// Allows the user to change the timer duration and other setting
function Settings(props: SettingsProp) {
  // whether the settings modal is open
  const [isOpen, setIsOpen] = useState(false)
  const { workDuration, shortBreakDuration, longBreakDuration, pomsPerSet } =
    props.user.pomSettings
  const [workTime, setWorkTime] = useState(workDuration)
  const [shortBreakTime, setShortBreakTime] = useState(shortBreakDuration)
  const [longBreakTime, setLongBreakTime] = useState(longBreakDuration)
  const [numPomsInSet, setNumPoms] = useState(2)

  // close the settings modal
  function closeSettings() {
    setIsOpen(false)
  }

  // saves the settings to the firestore database and updates the user data
  function saveSettings() {
    console.log('Saving settings')
    // TODO push changes to firestore

    if (workTime === undefined) {
      setWorkTime(defaultPomSettings.workDuration)
    }
    if (shortBreakTime === undefined) {
      setShortBreakTime(defaultPomSettings.shortBreakDuration)
    }
    if (longBreakTime === undefined) {
      setLongBreakTime(defaultPomSettings.longBreakDuration)
    }

    const newPomSettings: PomSettings = {
      workDuration: workTime,
      shortBreakDuration: shortBreakTime,
      longBreakDuration: longBreakTime,
      pomsPerSet: numPomsInSet,
    }

    props.user.saveNewSettings(newPomSettings)

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
