interface TimeInputProp {
  name: string
  value: number
  setValue: (newVal: number) => void
}

// A time input field for the pomodoro settings form
function TimeInput(props: TimeInputProp) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newVal = parseInt(event.target.value)
    // fix so empty input is accepted as well
    if (newVal > 0 && newVal < 1440) {
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
