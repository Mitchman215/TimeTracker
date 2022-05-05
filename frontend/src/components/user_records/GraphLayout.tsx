import { Box, Stack } from '@mui/material'
import React, { FC, useState } from 'react'
import { RecordClassDoc } from '../../types'
import GraphBackground from './GraphBackground'

export interface GraphLayoutProps {
  children: RecordClassDoc[]
  user: string
}

const GraphLayout: FC<GraphLayoutProps> = ({ children, user }) => {
  const [className, setClassName] = useState('')
  const [startStamp, setStartStamp] = useState('')
  const [finishStamp, setFinishStamp] = useState('')
  const [duration, setDuration] = useState('')

  return (
    <Stack direction="row" spacing={5}>
      <Box
        className="bg-white w-1/3 p-4 rounded-lg"
        sx={{
          height: 300,
        }}
      >
        <div className="text-xl font-bold">Class Name: {className}</div>
        <div className="text-xl font-bold">Start Stamp: {startStamp}</div>
        <div className="text-xl font-bold">Finish Stamp: {finishStamp}</div>
        <div className="text-xl font-bold">Duration: {duration}</div>
      </Box>
      <GraphBackground
        user={user}
        children={children}
        setClassName={setClassName}
        setStartStamp={setStartStamp}
        setFinishStamp={setFinishStamp}
        setDuration={setDuration}
      />
    </Stack>
  )
}

export default GraphLayout
