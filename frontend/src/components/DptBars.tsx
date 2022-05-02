import { Box, Stack } from '@mui/material'
import { FC, useState } from 'react'

export interface DptBarsProps {
  dptName: string
  dailyAvg: number
  weeklyAvg: number
  totalTime: number
  setDptName: (dpt: string) => void
  setDailyAvg: (time: string) => void
  setWeeklyAvg: (time: string) => void
  setTotalTime: (time: string) => void
}

const DptBars: FC<DptBarsProps> = ({
  dptName,
  dailyAvg,
  weeklyAvg,
  totalTime,
  setDptName,
  setDailyAvg,
  setWeeklyAvg,
  setTotalTime,
}) => {
  const [backgroundColorTop, setBGT] = useState('#D8B4FE')
  const [backgroundColorM, setBGM] = useState('#9333EA')
  const [backgroundColorBot, setBGB] = useState('#581C87')
  return (
    <div
      className="flex flex-col items-end w-full"
      onMouseEnter={() => {
        setDptName(dptName)
        setDailyAvg(dailyAvg.toString())
        setWeeklyAvg(weeklyAvg.toString())
        setTotalTime(totalTime.toString())
        setBGT('#A3A3A3')
        setBGM('#525252')
        setBGB('#171717')
      }}
      onMouseLeave={() => {
        setDptName('')
        setDailyAvg('')
        setWeeklyAvg('')
        setTotalTime('')
        setBGT('#D8B4FE')
        setBGM('#9333EA')
        setBGB('#581C87')
      }}
    >
      <Box
        className="w-full"
        sx={{
          height: totalTime - weeklyAvg - dailyAvg,
          backgroundColor: backgroundColorTop,
        }}
      />
      <Box
        className="w-full"
        sx={{
          height: weeklyAvg - dailyAvg,
          backgroundColor: backgroundColorM,
        }}
      />
      <Box
        className="w-full"
        sx={{
          height: dailyAvg,
          backgroundColor: backgroundColorBot,
        }}
      />
    </div>
  )
}

export default DptBars
