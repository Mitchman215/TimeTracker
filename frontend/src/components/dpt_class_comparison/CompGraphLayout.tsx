import { Box } from '@mui/material'
import React, { FC, useState } from 'react'
import { DptClassDoc } from '../../types'
import CompGraphBackground from './CompGraphBackground'
import ModalBar from './ModalBar'

/**
 * Interface for compgraphlayout props
 */
export interface CompGraphLayoutProps {
  children: DptClassDoc[]
  type: string
}

/**
 * Creates a container for a graph and a modal
 * @param children The departments or classes to be displayed as bars
 * @param type Department or class
 * @returns The container for a graph and a modal for hovering/adding bars
 */
const CompGraphLayout: FC<CompGraphLayoutProps> = ({ children, type }) => {
  const [name, setName] = useState('')
  const [dailyAvg, setDailyAvg] = useState('')
  const [weeklyAvg, setWeeklyAvg] = useState('')
  const [totalTime, setTotalTime] = useState('')
  const [modal, setModal] = useState(false)
  const empty: DptClassDoc[] = []
  const [editChildren, setEditChildren] = useState(empty)

  /**
   * Changes the modal back to a display for hovering
   */
  function closeModal(): void {
    setModal(false)
  }

  return (
    <div className="flex flex-row gap-10">
      {!modal && (
        <Box
          className="bg-white w-1/3 p-4 rounded-lg"
          sx={{
            height: 500,
          }}
        >
          <div className="text-xl font-bold">
            {type} Name: {name}
          </div>
          <div className="text-xl font-bold">Daily Average: {dailyAvg}</div>
          <div className="text-xl font-bold">Weekly Average: {weeklyAvg}</div>
          <div className="text-xl font-bold">Total Time: {totalTime}</div>
        </Box>
      )}
      {modal && (
        <Box
          className="bg-white w-1/3 p-4 rounded-lg relative flex flex-col items-center"
          sx={{
            height: 500,
          }}
        >
          <div className="flex text-lg font-bold w-full p-4">
            Select {type} to Compare
          </div>
          <div className="flex flex-col p-4 w-full gap-2">
            {children.map((child: DptClassDoc) => {
              return (
                <ModalBar
                  name={child.name}
                  child={child}
                  setEditChildren={setEditChildren}
                  children={editChildren.slice()}
                />
              )
            })}
          </div>
          <button
            className="w-6 h-6 bg-black absolute right-3 top-3 rounded-full text-white"
            onClick={closeModal}
          >
            -
          </button>
        </Box>
      )}
      <CompGraphBackground
        children={editChildren}
        setName={setName}
        setDailyAvg={setDailyAvg}
        setWeeklyAvg={setWeeklyAvg}
        setTotalTime={setTotalTime}
        setModal={setModal}
        type={type}
      />
    </div>
  )
}

export default CompGraphLayout
