import { FC, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import DptBars from './DptBars'

export interface DptGraphBackgroundProps {
  children: string[][]
  setDptName: (className: string) => void
  setDailyAvg: (timeStamp: string) => void
  setWeeklyAvg: (timeStamp: string) => void
  setTotalTime: (duration: string) => void
}

const DptGraphBackground: FC<DptGraphBackgroundProps> = ({
  children,
  setDptName,
  setDailyAvg,
  setWeeklyAvg,
  setTotalTime,
}) => {
  return (
    <div className="bg-white w-1/2 py-2 flex items-center flex-col relative justify-center rounded-lg">
      <div className="font-bold text-sm">Time By Class</div>
      <div className="px-16 py-4 w-full h-full flex items-end flex-row relative">
        <div className="font-bold absolute inset-y-0 left-2 w-10 flex justify-center items-center">
          <div className="font-bold text-xs -rotate-90">Duration(s)</div>
        </div>
        <div className="flex w-full h-full gap-4 items-end border border-black border-t-0 border-l-1 border-r-0 border-b-1">
          {children.map((child: string[]) => {
            return (
              <DptBars
                dailyAvg={parseInt(child[0])}
                dptName={child[1]}
                weeklyAvg={parseInt(child[2])}
                totalTime={parseInt(child[3])}
                setDptName={setDptName}
                setDailyAvg={setDailyAvg}
                setWeeklyAvg={setWeeklyAvg}
                setTotalTime={setTotalTime}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DptGraphBackground
