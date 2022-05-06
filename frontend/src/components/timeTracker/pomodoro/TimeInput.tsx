import { useEffect } from 'react'

interface TimeInputProp {
  name: string
  value: number | undefined
  default: number
  setValue: (newVal: number) => void
}

// A time input field for the pomodoro settings form
function TimeInput(props: TimeInputProp) {
  // when the component first loads, if the initial value is undefined, set it to the default
  useEffect(() => {
    if (props.value === undefined) {
      props.setValue(props.default)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // called when the user changes the input, updates the value with setValue
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newVal = parseInt(event.target.value)
    // fix so empty input is accepted as well
    if (Number.isNaN(newVal) || (newVal > 0 && newVal < 1440)) {
      props.setValue(newVal)
    }
  }

  return (
    <label className="flex flex-col w-24">
      {props.name}
      <input
        type="number"
        name={props.name}
        value={props.value}
        onChange={handleChange}
        className="bg-slate-100 p-1"
      />
    </label>
  )
}

export default TimeInput
