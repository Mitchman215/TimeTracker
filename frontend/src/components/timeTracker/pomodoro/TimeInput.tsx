import { useEffect } from 'react'

interface NumInputProps {
  name: string
  value: string
  setValue: (newVal: string) => void
  default?: number
  min?: number
  max?: number
  isInt?: boolean
}

// A time input field for the pomodoro settings form
function NumInput(props: NumInputProps) {
  // when the component first loads, if the initial value is empty, set it to the default
  useEffect(() => {
    if (props.value === '' && props.default !== undefined) {
      props.setValue(props.default.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validNum = props.isInt ? /^[\d]*$/ : /^(\d*\.)?\d*$/

  // called when the user changes the input, updates the value with setValue
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const val = event.target.value
    // allow empty input
    if (!val) {
      props.setValue(val)
    }
    // if min isn't specified, make it 0
    const min = props.min ? props.min : 0
    // if max isn't specified, make it 1440 (number of mins in one day)
    const max = props.max ? props.max : 1440
    // check input is a valid number and within the range
    const num = props.isInt ? parseInt(val) : parseFloat(val)
    if (validNum.test(val) && num >= min && num < max) {
      props.setValue(props.isInt ? num.toString() : val)
    }
  }

  return (
    <label className="flex flex-col m-2">
      {props.name}
      <input
        type="text"
        name={props.name}
        value={props.value}
        onChange={handleChange}
        className="bg-slate-100 p-1"
      />
    </label>
  )
}

export default NumInput
