import { Box } from '@mui/material'
import { FC, useState } from 'react'

export interface CompBarsProps {
  name: string
  dailyAvg: number
  weeklyAvg: number
  totalTime: number
  setName: (name: string) => void
  setDailyAvg: (time: string) => void
  setWeeklyAvg: (time: string) => void
  setTotalTime: (time: string) => void
}

const CompBars: FC<CompBarsProps> = ({
  name,
  dailyAvg,
  weeklyAvg,
  totalTime,
  setName,
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
        setName(name)
        setDailyAvg(dailyAvg.toString())
        setWeeklyAvg(weeklyAvg.toString())
        setTotalTime(totalTime.toString())
        setBGT('#A3A3A3')
        setBGM('#525252')
        setBGB('#171717')
      }}
      onMouseLeave={() => {
        setName('')
        setDailyAvg('')
        setWeeklyAvg('')
        setTotalTime('')
        setBGT('#D8B4FE')
        setBGM('#9333EA')
        setBGB('#581C87')
      }}
    >
      <Box
        className="w-full items-center justify-center flex text-xs font-bold"
        sx={{
          height: 3,
          backgroundColor: backgroundColorTop,
        }}
      />
      <div className="w-full items-center justify-center flex text-xs font-bold">
        Total Time
      </div>
      <Box
        className="w-full"
        sx={{
          height: totalTime - weeklyAvg * 5 - dailyAvg * 5,
          backgroundColor: backgroundColorTop,
        }}
      />
      <div className="w-full items-center justify-center flex text-xs font-bold">
        Weekly Average (5x magnified)
      </div>
      <Box
        className="w-full"
        sx={{
          height: weeklyAvg * 5 - dailyAvg * 5,
          backgroundColor: backgroundColorM,
        }}
      />
      <div className="w-full items-center justify-center flex text-xs font-bold">
        Daily Average (5x magnified)
      </div>
      <Box
        className="w-full"
        sx={{
          height: dailyAvg * 5,
          backgroundColor: backgroundColorBot,
        }}
      />
    </div>
  )
}

export default CompBars
