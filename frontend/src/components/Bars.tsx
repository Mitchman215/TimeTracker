import { Box, Stack } from '@mui/material'
import { FC } from 'react'

export interface BarsProps {
  size: number
  className: string
  startStamp: string
  finishStamp: string
  setClassName: (className: string) => void
  setStartStamp: (timeStamp: string) => void
  setFinishStamp: (finishStamp: string) => void
  setDuration: (duration: string) => void
}

const Bars: FC<BarsProps> = ({
  size,
  className,
  startStamp,
  finishStamp,
  setClassName,
  setStartStamp,
  setFinishStamp,
  setDuration,
}) => {
  return (
    <Box
      onMouseEnter={() => {
        setClassName(className)
        setStartStamp(startStamp)
        setFinishStamp(finishStamp)
        setDuration(size.toString())
      }}
      onMouseLeave={() => {
        setClassName('')
        setStartStamp('')
        setFinishStamp('')
        setDuration('')
      }}
      className="bg-violet-900 hover:bg-violet-600 w-full"
      sx={{
        height: size,
      }}
    />
  )
}

export default Bars
