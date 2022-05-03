import { useState } from 'react'
import Modal from 'react-modal'
import { IoMdSettings } from 'react-icons/io'
import { PomodoroProp } from './Pomodoro'
import TimeInput from './TimeInput'

// ensures background content is hidden for screen readers when settings is open
Modal.setAppElement('#root')

// Component for the settings modal for the Pomodoro Timer.
// Allows the user to change the timer duration and other setting
function Settings(props: PomodoroProp) {
  const [isOpen, setIsOpen] = useState(false)
  const [workTime, setWorkTime] = useState(25)
  const [shortBreakTime, setShortBreakTime] = useState(5)
  const [longBreakTime, setLongBreakTime] = useState(15)

  // saves the settings to the firestore database and updates the user data
  function saveSettings() {
    console.log('Saving settings')
    // TODO integrate and finish
  }

  return (
    <div>
      <button className="text-2xl" onClick={() => setIsOpen(true)}>
        <IoMdSettings />
      </button>
      <Modal isOpen={isOpen}>
        <h2 className="text-2xl text-bold">Settings</h2>
        <h3 className="text-xl">Time settings (in minutes)</h3>
        <form className="flex flex-row justify-between">
          <TimeInput name="Work" value={workTime} setValue={setWorkTime} />
          <TimeInput
            name="Short Break"
            value={shortBreakTime}
            setValue={setShortBreakTime}
          />
          <TimeInput
            name="Long Break"
            value={longBreakTime}
            setValue={setLongBreakTime}
          />
        </form>

        <div className="flex mt-4">
          <button className="btn-purple" onClick={() => setIsOpen(false)}>
            Close
          </button>
          <button className="btn-purple" onClick={saveSettings}>
            Save
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Settings
