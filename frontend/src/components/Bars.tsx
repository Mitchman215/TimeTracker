import { Box, Stack } from '@mui/material'
import { FC, useState } from 'react'

export interface BarsProps {
  size: number
  className: string
  timeStamp: string
  setClassName: (className: string) => void
  setTimeStamp: (className: string) => void
  setDuration: (className: string) => void
}

const Bars: FC<BarsProps> = ({
  size,
  className,
  timeStamp,
  setClassName,
  setTimeStamp,
  setDuration,
}) => {
  return (
    <Stack className="w-1/4" direction="column">
      <Box
        className="bg-white"
        sx={{
          height: 275 - size,
        }}
      />
      <Box
        onMouseEnter={() => {
          setClassName(className)
          setTimeStamp(timeStamp)
          setDuration(size.toString())
        }}
        onMouseLeave={() => {
          setClassName('')
          setTimeStamp('')
          setDuration('')
        }}
        className="bg-violet-900"
        sx={{
          height: size,
          '&:hover': {
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      />
    </Stack>
  )
}

export default Bars
