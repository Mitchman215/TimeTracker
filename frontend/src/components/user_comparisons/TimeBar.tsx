import { Box } from '@mui/material'
import React, { FC, useState } from 'react'

/**
 * TimeBar interface
 */
export interface TimeBarProps {
  setDay: (day: boolean) => void
  setWeek: (week: boolean) => void
  setMonth: (month: boolean) => void
  setDisplay: (display: string[]) => void
}

/**
 * Bar on the graph that allows the user to select the time period of comparison:
 * D - day, W - week, M - month
 * @param setDay Function to set whether or not the days are displayed as bars
 * @param setWeek Function to set whether or not the weeks are displayed as bars
 * @param setMonth Function to set whether or not the months are displayes as bars
 * @param setDisplay Function to set the passive display of the hovering modal
 * @returns The display of the time bar
 */
const TimeBar: FC<TimeBarProps> = ({
  setDay,
  setWeek,
  setMonth,
  setDisplay,
}) => {
  const [bOne, setBOne] = useState('#A855F7')
  const [bTwo, setBTwo] = useState('#A855F7')
  const [bThree, setBThree] = useState('#A855F7')

  const blackColor = '#000000'
  const resetColor = '#A855F7'

  return (
    <div className="absolute top-0 right-0 w-1/5 bg-purple-400 rounded-full h-7 flex justify-center flex-row items-center gap-3">
      <Box
        className="w-5 h-5 bg-purple-200 rounded-full"
        sx={{ backgroundColor: bOne }}
      >
        <button
          className="w-full rounded-full h-full text-xs font-bold flex items-center justify-center text-white"
          onClick={() => {
            setBOne(blackColor)
            setBTwo(resetColor)
            setBThree(resetColor)
            setDay(true)
            setWeek(false)
            setMonth(false)
            setDisplay([`Class:`, `Average:`, `Day:`])
          }}
          id="day-button"
        >
          D
        </button>
      </Box>
      <Box
        className="w-5 h-5 bg-purple-200 rounded-full"
        sx={{ backgroundColor: bTwo }}
      >
        <button
          className="w-full rounded-full h-full text-xs font-bold flex items-center justify-center text-white"
          onClick={() => {
            setBOne(resetColor)
            setBTwo(blackColor)
            setBThree(resetColor)
            setDay(false)
            setWeek(true)
            setMonth(false)
            setDisplay([`Class:`, `Average:`, `Start:`, `Finish:`])
          }}
          id="week-button"
        >
          W
        </button>
      </Box>
      <Box
        className="w-5 h-5 bg-purple-200 rounded-full"
        sx={{ backgroundColor: bThree }}
      >
        <button
          className="w-full rounded-full h-full text-xs font-bold flex items-center justify-center text-white"
          onClick={() => {
            setBOne(resetColor)
            setBTwo(resetColor)
            setBThree(blackColor)
            setDay(false)
            setWeek(false)
            setMonth(true)
            setDisplay([`Class:`, `Average:`, `Month:`])
          }}
          id="month-button"
        >
          M
        </button>
      </Box>
      <button
        className="w-5 bg-red-400 rounded-full h-5 text-xs font-bold"
        onClick={() => {
          setBOne(resetColor)
          setBTwo(resetColor)
          setBThree(resetColor)
          setDay(false)
          setWeek(false)
          setMonth(false)
          setDisplay([])
        }}
        id="clear-button"
      >
        X
      </button>
    </div>
  )
}

export default TimeBar
