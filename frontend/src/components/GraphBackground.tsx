import { FC, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import Bars from './Bars'

export interface GraphBackgroundProps {
  children: string[][]
  user: string
  setClassName: (className: string) => void
  setStartStamp: (timeStamp: string) => void
  setFinishStamp: (timeStamp: string) => void
  setDuration: (duration: string) => void
}

const GraphBackground: FC<GraphBackgroundProps> = ({
  children,
  user,
  setClassName,
  setStartStamp,
  setFinishStamp,
  setDuration,
}) => {
  return (
    <div className="bg-white w-1/2 py-2 flex items-center flex-col relative justify-center rounded-lg">
      <div className="font-bold text-sm">{user}'s Time By Class</div>
      <div className="px-16 py-4 w-full h-full flex items-end flex-row relative">
        <div className="font-bold absolute inset-y-0 left-2 w-10 flex justify-center items-center">
          <div className="font-bold text-xs -rotate-90">Duration(s)</div>
        </div>
        <div className="flex w-full h-full gap-4 items-end border border-black border-t-0 border-l-1 border-r-0 border-b-1">
          {children.map((child: string[]) => {
            return (
              <Bars
                size={parseInt(child[0])}
                className={child[1]}
                startStamp={child[2]}
                finishStamp={child[3]}
                setClassName={setClassName}
                setStartStamp={setStartStamp}
                setFinishStamp={setFinishStamp}
                setDuration={setDuration}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GraphBackground
