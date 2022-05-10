import { FormEvent, useState } from 'react'
import Modal from 'react-modal'
import { IoMdSettings } from 'react-icons/io'
import { MdClose } from 'react-icons/md'
import NumInput from './NumInput'
import { UserProp } from '../../../models/User'
import { defaultPomSettings, PomSettings } from '../../../models/PomSettings'

// ensures background content is hidden for screen readers when settings is open
Modal.setAppElement('#root')

// Component for the settings modal for the Pomodoro Timer.
// Allows the user to change the timer duration and other setting
function Settings({ user }: UserProp) {
  // whether the settings modal is open
  const [isOpen, setIsOpen] = useState(false)
  const {
    workDuration: initWork,
    shortBreakDuration: initSBreak,
    longBreakDuration: initLBreak,
    pomsPerSet: initNumPoms,
  } = user.pomSettings
  // state for settings form, times are represented in minutes
  const [workTime, setWork] = useState(String(initWork / 60))
  const [shortBreakTime, setShortBreak] = useState(String(initSBreak / 60))
  const [longBreakTime, setLongBreak] = useState(String(initLBreak / 60))
  const [numPoms, setNumPoms] = useState(String(initNumPoms))

  // note: these default times are in seconds
  const {
    workDuration: defaultWork,
    shortBreakDuration: defaultSBreak,
    longBreakDuration: defaultLBreak,
    pomsPerSet: defaultNumPoms,
  } = defaultPomSettings

  // close the settings modal
  function closeSettings() {
    setIsOpen(false)
  }

  // saves the settings to the firestore database and updates the user data
  function saveSettings(e: FormEvent) {
    e.preventDefault()

    // convert form data to numbers and to seconds
    let workDuration = parseFloat(workTime) * 60
    let longBreakDuration = parseFloat(longBreakTime) * 60
    let shortBreakDuration = parseFloat(shortBreakTime) * 60
    let pomsPerSet = parseInt(numPoms)

    // if the form values are incomplete, set them to the defaults
    if (Number.isNaN(workDuration)) {
      workDuration = defaultWork
    }
    if (Number.isNaN(longBreakDuration)) {
      longBreakDuration = defaultLBreak
    }
    if (Number.isNaN(shortBreakDuration)) {
      shortBreakDuration = defaultSBreak
    }
    if (Number.isNaN(pomsPerSet)) {
      pomsPerSet = defaultNumPoms
    }

    const newPomSettings: PomSettings = {
      workDuration,
      shortBreakDuration,
      longBreakDuration,
      pomsPerSet,
    }
    console.log('Saving settings')
    console.log({ newPomSettings })

    user.saveNewSettings(newPomSettings)

    closeSettings()
  }
  const modalStyle = {
    overlay: {},
    content: {
      width: 'fit-content',
      margin: 'auto',
      height: 'fit-content',
    },
  }

  return (
    <>
      <button
        className="text-2xl text-neutral-100"
        onClick={() => setIsOpen(true)}
      >
        <IoMdSettings />
      </button>
      <div className="flex justify-center">
        <Modal isOpen={isOpen} style={modalStyle}>
          <form className="w-96">
            <div className="flex flex-row justify-between mb-2">
              <h1 className="text-3xl text-bold">Settings</h1>
              <button className="text-3xl" onClick={closeSettings}>
                <MdClose />
              </button>
            </div>
            <h2 className="text-xl">Time settings (in minutes)</h2>
            <div className="flex flex-row justify-between">
              <NumInput
                name="Work"
                value={workTime}
                setValue={setWork}
                default={defaultWork / 60}
              />
              <NumInput
                name="Short Break"
                value={shortBreakTime}
                setValue={setShortBreak}
                default={defaultSBreak / 60}
              />
              <NumInput
                name="Long Break"
                value={longBreakTime}
                setValue={setLongBreak}
                default={defaultLBreak / 60}
              />
            </div>
            <h2 className="text-xl">Other settings</h2>
            <NumInput
              name="Number of Poms per set"
              value={numPoms}
              setValue={setNumPoms}
              default={defaultNumPoms}
              min={1}
              max={1000}
              isInt={true}
            />

            <div className="flex mt-4">
              <button
                className="btn-purple"
                onClick={saveSettings}
                type="submit"
              >
                Save and close
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  )
}

export default Settings
