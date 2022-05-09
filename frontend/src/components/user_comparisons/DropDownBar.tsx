import React, { FC, useState } from 'react'
import { UserClassDoc } from '../../types'

/**
 * Interface for dropdrown props
 */
export interface DropDownProps {
  child: UserClassDoc
  children: UserClassDoc[]
  setDisplay: (children: UserClassDoc[]) => void
}

/**
 * Dropdown bar of a class the user is taking
 * @param child The class a user is taking
 * @param children The classes a user is taking
 * @param setDisplay Adds or removes the bar from the dropdown
 * @returns Displays the dropdown
 */
const DropDownBar: FC<DropDownProps> = ({ child, children, setDisplay }) => {
  const [added, setAdded] = useState(child.added)

  /**
   * Handles the click of each dropdown bar by adding or removing it from the graph
   * and changing the "added" tag
   */
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
