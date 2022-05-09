import { Box } from '@mui/material'
import { FC } from 'react'

/**
 * Interface for bars
 */
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

/**
 * Creates a bar on the graph
 * @param size the height of the bar representing duration
 * @param className the class name of the bar
 * @param startStamp the starting time of the record
 * @param finishStamp the finish time of the record
 * @param setClassName a function to set the class name on the modal for hovering
 * @param setStartStamp a function to set the start time on the modal for hovering
 * @param setFinishStamp a function to set the finish time on the modal for hovering
 * @param setDuration a function to set the duration on the modal for hovering
 * @returns the bar on the graph
 */
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
