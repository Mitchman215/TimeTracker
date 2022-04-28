import { FC, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import Bars from './Bars'

export interface GraphBackgroundProps {
  children: string[][]
  width: number
  setClassName: (className: string) => void
  setTimeStamp: (timeStamp: string) => void
  setDuration: (duration: string) => void
}

const GraphBackground: FC<GraphBackgroundProps> = ({
  children,
  width,
  setClassName,
  setTimeStamp,
  setDuration,
}) => {
  return (
    <Box
      className="relative bg-white w-1/2 p-4"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 300,
        backgroundColor: 'white',
        borderRadius: 4,
        bottom: 0,
      }}
    >
      <Stack className="relative bottom-0 left-0" direction="row" spacing={4}>
        {children.map((child: string[]) => {
          return (
            <Bars
              size={parseInt(child[0])}
              className={child[1]}
              timeStamp={child[2]}
              setClassName={setClassName}
              setTimeStamp={setTimeStamp}
              setDuration={setDuration}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

export default GraphBackground
