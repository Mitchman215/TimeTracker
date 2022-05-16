import { Box } from '@mui/material'
import React, { FC } from 'react'
import {
  DailyAverage,
  MonthlyAverage,
  UserClassDoc,
  WeeklyAverage,
} from '../../types'

/**
 * Inteface of UserBars
 */
export interface UserBarsProps {
  day: boolean
  week: boolean
  month: boolean
  child: UserClassDoc
  display: string[][]
  setDisplay: (display: string[]) => void
}

/**
 * Creates a bar for the graph
 * @param day Whether or not the day button is switched
 * @param week Whether or not the week button is switched
 * @param month Whether or not the month button is switched
 * @param child The data representing the bar
 * @param display The data that should be displayed when the user is not hovering
 * @param setDisplay Function to set modal display
 * @returns A bar for the graph
 */
const UserBars: FC<UserBarsProps> = ({
  day,
  week,
  month,
  child,
  display,
  setDisplay,
}) => {
  return (
    <div className="w-full h-full bg-purple-200">
      {day && (
        <div className="w-full h-full flex flex-col relative items-center">
          <div className="absolute top-3 text-sm font-bold">{child.name}</div>
          <div className="w-full h-full">
            <div className="w-full flex flex-row h-full gap-2 items-end">
              {child.daily_averages.map((unit: DailyAverage) => {
                return (
                  <Box
                    onMouseEnter={() => {
                      setDisplay([
                        `Class: ${child.name}`,
                        `Average: ${(unit.average / 3600).toFixed(1)} hours`,
                        `Day: ${unit.day.toDate().toLocaleDateString()}`,
                      ])
                    }}
                    onMouseLeave={() => {
                      setDisplay(display[0])
                    }}
                    className="w-full bg-purple-800 hover:bg-purple-500"
                    sx={{
                      height: (unit.average / 3600) * 25,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}
      {week && (
        <div className="w-full h-full flex flex-col relative items-center">
          <div className="absolute top-3 text-sm font-bold">{child.name}</div>
          <div className="w-full h-full">
            <div className="w-full flex flex-row h-full gap-2 items-end">
              {child.weekly_averages.map((unit: WeeklyAverage) => {
                return (
                  <Box
                    onMouseEnter={() => {
                      setDisplay([
                        `Class: ${child.name}`,
                        `Average: ${(unit.average / 3600).toFixed(1)} Hours`,
                        `Start: ${unit.start.toDate().toLocaleDateString()}`,
                        `Finish: ${unit.finish.toDate().toLocaleDateString()}`,
                      ])
                    }}
                    onMouseLeave={() => {
                      setDisplay(display[1])
                    }}
                    className="w-full bg-purple-800 hover:bg-purple-500"
                    sx={{
                      height: (unit.average / 3600) * 5,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}
      {month && (
        <div className="w-full h-full flex flex-col relative items-center">
          <div className="absolute top-3 text-sm font-bold">{child.name}</div>
          <div className="w-full h-full">
            <div className="w-full flex flex-row h-full gap-2 items-end">
              {child.monthly_averages.map((unit: MonthlyAverage) => {
                return (
                  <Box
                    onMouseEnter={() => {
                      setDisplay([
                        `Class: ${child.name}`,
                        `Average: ${(unit.average / 3600).toFixed(1)} hours`,
                        `Month: ${unit.month}`,
                      ])
                    }}
                    onMouseLeave={() => {
                      setDisplay(display[2])
                    }}
                    className="w-full bg-purple-800 hover:bg-purple-500"
                    sx={{
                      height: (unit.average / 3600) * 5,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserBars
