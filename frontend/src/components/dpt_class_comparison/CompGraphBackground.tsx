import { FC } from 'react'
import CompBars from './CompBars'
import { DptClassDoc } from '../../types'

export interface CompGraphBackgroundProps {
  children: DptClassDoc[]
  setName: (name: string) => void
  setDailyAvg: (timeStamp: string) => void
  setWeeklyAvg: (timeStamp: string) => void
  setTotalTime: (duration: string) => void
  setModal: (modal: boolean) => void
  type: string
}

const CompGraphBackground: FC<CompGraphBackgroundProps> = ({
  children,
  setName,
  setDailyAvg,
  setWeeklyAvg,
  setTotalTime,
  setModal,
  type,
}) => {
  function changeModal(): void {
    setModal(true)
  }

  return (
    <div className="bg-white w-2/3 py-2 flex items-center flex-col relative justify-center rounded-lg">
      <div className="flex flex-row justify-center w-full gap-2">
        <div className="font-bold text-sm">Time By {type}</div>
        <div className="bg-black w-6 h-6 rounded-full text-white flex justify-center items-center">
          <button className="w-full h-full" onClick={changeModal}>
            +
          </button>
        </div>
      </div>
      <div className="px-16 py-4 w-full h-full flex items-end flex-row relative">
        <div className="font-bold absolute inset-y-0 left-2 w-10 flex justify-center items-center">
          <div className="font-bold text-xs -rotate-90">Duration(hr)</div>
        </div>
        <div className="flex w-full h-full gap-2 items-end border border-black border-t-0 border-l-1 border-r-0 border-b-1">
          {children.map((child: DptClassDoc) => {
            return (
              <CompBars
                dailyAvg={parseInt(child.daily_average)}
                name={child.name}
                weeklyAvg={parseInt(child.weekly_average)}
                totalTime={parseInt(child.total_time)}
                setName={setName}
                setDailyAvg={setDailyAvg}
                setWeeklyAvg={setWeeklyAvg}
                setTotalTime={setTotalTime}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CompGraphBackground
