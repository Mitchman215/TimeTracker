import React, { FC, useState } from 'react'
import { DptClassDoc } from '../../types'

/**
 * Interface for ModalBar
 */
export interface ModalBarProps {
  name: string
  child: DptClassDoc
  setEditChildren: (children: DptClassDoc[]) => void
  children: DptClassDoc[]
}

/**
 * A bar representing one class or department that the user can select or
 * deselect in the modal
 * @param name The name of the department or class
 * @param child The dptclassdoc
 * @param setEditChildren Function to edit the displayed departments or classes
 * in the graph
 * @param children The bars to be displayed on the graph
 * @returns A modal bar
 */
const ModalBar: FC<ModalBarProps> = ({
  name,
  child,
  setEditChildren,
  children,
}) => {
  const [check, setCheck] = useState(child.added)

  /**
   * Handles adding or unadding a dpt/class to the set of displayed bars. If the
   * user wants to unadd the object, we must filter the children by name to remove it
   * from the list and update the state. If the user wants to add it, we just push it to
   * the children list and update the state.
   */
  function checkAppear(): void {
    if (!check) {
      const copyArr: DptClassDoc[] = [...children]
      if (
        copyArr.filter((unitChild: DptClassDoc) => unitChild.name != name)
          .length == children.length
      ) {
        child.added = true
        children.push(child)
        setEditChildren(children)
      }
    } else {
      let copyArr: DptClassDoc[] = [...children]
      copyArr.map((unitChild: DptClassDoc) => {
        if (unitChild.name == name) {
          unitChild.added = false
        }
      })
      copyArr = copyArr.filter(
        (unitChild: DptClassDoc) => unitChild.name != name
      )
      setEditChildren(copyArr)
    }
    setCheck(!check)
  }

  return (
    <button
      className="w-full bg-purple-700 h-full flex flex-row gap-4 justify-center items-center rounded-lg"
      onClick={checkAppear}
    >
      <div className="text-sm">{name}</div>
      {check && <div className="font-bold text-xs">Added</div>}
    </button>
  )
}

export default ModalBar
