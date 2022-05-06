import React, { FC, useState } from 'react'
import { UserClassDoc } from '../../types'

export interface DropDownProps {
  child: UserClassDoc
  children: UserClassDoc[]
  setDisplay: (children: UserClassDoc[]) => void
}

const DropDownBar: FC<DropDownProps> = ({ child, children, setDisplay }) => {
  const [added, setAdded] = useState(child.added)

  function handle(): void {
    const newArr: UserClassDoc[] = added
      ? children.filter((unit: UserClassDoc) => unit.name != child.name)
      : [...children, child]

    setDisplay(newArr)
    child.added = !added
    setAdded(!added)
  }
  return (
    <button
      className="bg-purple-200 rounded-full w-1/2 flex flex-row items-center justify-center h-full gap-4"
      onClick={handle}
    >
      <div>{child.name}</div>
      {added && <div className="text-sm font-bold">Added</div>}
    </button>
  )
}

export default DropDownBar
