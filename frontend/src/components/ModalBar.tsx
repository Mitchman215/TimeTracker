import React, { FC, useState } from 'react'

export interface ModalBarProps {
  name: string
  child: string[]
  setEditChildren: (children: string[][]) => void
  children: string[][]
}

const ModalBar: FC<ModalBarProps> = ({
  name,
  child,
  setEditChildren,
  children,
}) => {
  const [check, setCheck] = useState(child[4] == 'true')

  function checkAppear(): void {
    if (!check) {
      const copyArr: string[][] = [...children]
      if (
        copyArr.filter((unitChild) => unitChild[1] != name).length ==
        children.length
      ) {
        child[4] = 'true'
        children.push(child)
        setEditChildren(children)
        console.log(children)
      }
    } else {
      let copyArr: string[][] = [...children]
      copyArr.map((unitChild) => {
        if (unitChild[1] == name) {
          unitChild[4] = 'false'
        }
      })
      console.log(copyArr)
      copyArr = copyArr.filter((unitChild) => unitChild[1] != name)
      setEditChildren(copyArr)
    }
    setCheck(!check)
  }

  return (
    <button
      className="w-full bg-purple-700 flex flex-row gap-4 justify-center items-center rounded-full"
      onClick={checkAppear}
    >
      <div className="text-sm">{name}</div>
      {check && <div className="font-bold text-xs">Added</div>}
    </button>
  )
}

export default ModalBar
