import { FC, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import Bars from './Bars'

export interface GraphBackgroundProps {
  children: number[]
  width: number
  timestamps: string[]
}

const GraphBackground: FC<GraphBackgroundProps> = ({
  children,
  width,
  timestamps,
}) => {
  const axisPoints: number[] = []
  const [display, setDisplay] = useState('')

  for (let i = 0; i < children.length; i++) {
    axisPoints.push(((i + 1) * width) / children.length)
  }

  return (
    <Box
      className="relative bg-white w-1/2 p-4"
      onMouseEnter={() => setDisplay('Hi Vatsal :)')}
      onMouseLeave={() => setDisplay('')}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 300,
        backgroundColor: 'white',
        borderRadius: 4,
        bottom: 0,
        '&:hover': {
          backgroundColor: 'primary.main',
          opacity: [0.9, 0.8, 0.7],
        },
      }}
    >
      <Stack className="relative bottom-0 left-0" direction="row" spacing={4}>
        {children.map((bar: number) => {
          return <Bars size={bar} />
        })}
      </Stack>
    </Box>
  )
}

export default GraphBackground
