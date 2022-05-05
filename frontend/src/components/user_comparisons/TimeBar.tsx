import { Box } from '@mui/material'
import React, { FC, useState } from 'react'

export interface TimeBarProps {
  setDay: (day: boolean) => void
  setWeek: (week: boolean) => void
  setMonth: (month: boolean) => void
  setDisplay: (display: string[]) => void
}

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
      >
        X
      </button>
    </div>
  )
}

export default TimeBar
