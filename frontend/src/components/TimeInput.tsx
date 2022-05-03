interface TimeInputProp {
  name: string
  value: number
  setValue: (newVal: number) => void
}

function TimeInput(props: TimeInputProp) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newVal = parseInt(event.target.value)
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
