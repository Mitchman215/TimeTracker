import { Box } from '@mui/material'
import React, { FC, useState } from 'react'
import { UserClassDoc } from '../../types'
import DropDownBar from './DropDownBar'
import TimeBar from './TimeBar'
import UserBars from './UserBars'

/**
 * Interface of userclassmenu
 */
export interface UserClassMenuProps {
  children: UserClassDoc[]
}

/**
 * The dropdown menu for a user to select their classes to compare
 * @param children The classes the user is taking
 * @returns The dropdown menu
 */
const UserClassMenu: FC<UserClassMenuProps> = ({ children }) => {
  const [dropdown, setDropDown] = useState(false)
  const empty: UserClassDoc[] = []
  const strEmpty: string[] = []
  const [displayChildren, setDisplayChildren] = useState(empty)
  const [day, setDay] = useState(false)
  const [week, setWeek] = useState(false)
  const [month, setMonth] = useState(false)
  const [display, setDisplay] = useState(strEmpty)

  const dailyInitial = [`Class:`, `Average:`, `Day:`]
  const weeklyInitial = [`Class:`, `Average:`, `Start:`, `Finish:`]
  const monthlyInitial = [`Class:`, `Average:`, `Month:`]
  const displays = [dailyInitial, weeklyInitial, monthlyInitial]

  /**
   * Reverses the state of the dropdown display (on or off)
   */
  function dropdownSwitch(): void {
    setDropDown(!dropdown)
  }
  return (
    <div className="flex flex-col w-full">
      {!dropdown && (
        <div className="rounded-full w-full h-20 bg-purple-400 flex flex-row items-center justify-center gap-4 p-4">
          <button className="text-sm font-bold" onClick={dropdownSwitch}>
            Add Classes
          </button>
        </div>
      )}
      {dropdown && (
        <Box
          className="w-full bg-purple-400 flex flex-col items-center gap-2 p-4"
          sx={{
            height: 200,
            borderRadius: 10,
          }}
        >
          <button className="text-sm font-bold" onClick={dropdownSwitch}>
            Close
          </button>
          {children.map((child: UserClassDoc) => {
            return (
              <DropDownBar
                child={child}
                children={displayChildren}
                setDisplay={setDisplayChildren}
              />
            )
          })}
        </Box>
      )}
      <div className="w-full flex flex-row gap-10">
        <div className="w-1/3 round-lg bg-white rounded-lg text-xl font-bold p-4">
          {display.map((unit: string) => {
            return <div>{unit}</div>
          })}
        </div>
        <Box
          className="w-2/3 bg-white rounded-lg h-full flex flex-col gap-5 items-center p-4"
          sx={{ height: 500 }}
        >
          <div className="px-16 py-4 w-full h-full flex items-end flex-row relative">
            <div className="font-bold absolute inset-y-0 left-2 w-10 flex justify-center items-center">
              <div className="font-bold text-xs -rotate-90">Duration(s)</div>
            </div>
            <TimeBar
              setDay={setDay}
              setWeek={setWeek}
              setMonth={setMonth}
              setDisplay={setDisplay}
            />
            <div className="flex w-full h-full gap-2 items-end border border-black border-t-0 border-l-1 border-r-0 border-b-1">
              {displayChildren.map((child: UserClassDoc) => {
                return (
                  <UserBars
                    child={child}
                    day={day}
                    week={week}
                    month={month}
                    display={displays}
                    setDisplay={setDisplay}
                  />
                )
              })}
            </div>
          </div>
        </Box>
      </div>
    </div>
  )
}

export default UserClassMenu
