import { Box, Stack } from '@mui/material'
import React, { FC, useState } from 'react'
import DptGraphBackground from './DptGraphBackground'
import GraphBackground from './GraphBackground'

export interface DptGraphLayoutProps {
  children: string[][]
}

const DptGraphLayout: FC<DptGraphLayoutProps> = ({ children }) => {
  const [dptName, setDptName] = useState('')
  const [dailyAvg, setDailyAvg] = useState('')
  const [weeklyAvg, setWeeklyAvg] = useState('')
  const [totalTime, setTotalTime] = useState('')

  return (
    <Stack direction="row" spacing={5}>
      <Box
        className="bg-white w-1/2 p-4 rounded-lg"
        sx={{
          height: 500,
        }}
      >
        <div className="text-xl font-bold">Department Name: {dptName}</div>
        <div className="text-xl font-bold">Daily Average: {dailyAvg}</div>
        <div className="text-xl font-bold">Weekly Average: {weeklyAvg}</div>
        <div className="text-xl font-bold">Total Time: {totalTime}</div>
      </Box>
      <DptGraphBackground
        children={children}
        setDptName={setDptName}
        setDailyAvg={setDailyAvg}
        setWeeklyAvg={setWeeklyAvg}
        setTotalTime={setTotalTime}
      />
    </Stack>
  )
}

export default DptGraphLayout
