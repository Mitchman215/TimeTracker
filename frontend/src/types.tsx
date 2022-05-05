import { DocumentData, DocumentReference, Timestamp } from 'firebase/firestore'

type DailyAverage = {
  average: number
  day: Timestamp
}

type MonthlyAverage = {
  month: string
  average: number
}

type WeeklyAverage = {
  start: Timestamp
  finish: Timestamp
  average: number
}

type UserClassDoc = {
  class: DocumentReference<DocumentData>
  name: string
  daily_averages: DailyAverage[]
  monthly_averages: MonthlyAverage[]
  weekly_averages: WeeklyAverage[]
  added: boolean
}

type RecordClassDoc = {
  class: DocumentReference<DocumentData>
  class_name: string
  duration: number
  finish: Timestamp
  start: Timestamp
}

type DptClassDoc = {
  daily_average: string
  name: string
  total_time: string
  weekly_average: string
  added: boolean
}

export type {
  DailyAverage,
  MonthlyAverage,
  WeeklyAverage,
  UserClassDoc,
  RecordClassDoc,
  DptClassDoc,
}
