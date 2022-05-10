import { Box, Stack } from '@mui/material'
import React, { FC, useState } from 'react'
import { RecordClassDoc } from '../../types'
import GraphBackground from './GraphBackground'

/**
 * Interface for graph layout
 */
export interface GraphLayoutProps {
  children: RecordClassDoc[]
  user: string
}

/**
 * The graph layout
 * @param children the records of the user
 * @param user the email address of the user
 * @returns Creates a graph layout
 */
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
        id="left-box-records"
      >
        <div className="text-xl font-bold" id="class-name-records">
          Class Name: {className}
        </div>
        <div className="text-xl font-bold" id="start-stamp-records">
          Start Stamp: {startStamp}
        </div>
        <div className="text-xl font-bold" id="finish-stamp-records">
          Finish Stamp: {finishStamp}
        </div>
        <div className="text-xl font-bold" id="duration-records">
          Duration: {duration}
        </div>
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
