import React, { FC, useState } from 'react'
import { DptClassDoc } from '../../types'

export interface ModalBarProps {
  name: string
  child: DptClassDoc
  setEditChildren: (children: DptClassDoc[]) => void
  children: DptClassDoc[]
}

const ModalBar: FC<ModalBarProps> = ({
  name,
  child,
  setEditChildren,
  children,
}) => {
  const [check, setCheck] = useState(child.added)

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
