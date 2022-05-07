import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'

interface DayAverage {
  average: number
  day: Date
}

interface WeekAverage {
  average: number
  start: Date
  finish: Date
}

interface MonthAverage {
  average: number
  month: string
}

// Represents a class from a users' "classes" collection, mirrors firestore db
export default class Class {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly ref: DocumentReference,
    readonly dailyAverages: DayAverage[],
    readonly weeklyAverages: WeekAverage[],
    readonly monthlyAverages: MonthAverage[]
  ) {}
}

// Firestore data converter for Class
export const classConverter = {
  toFirestore(theClass: Class): DocumentData {
    return {
      id: theClass.id,
      name: theClass.name,
      class: theClass.ref,
      daily_averages: theClass.dailyAverages,
      weekly_averages: theClass.weeklyAverages,
      monthly_averages: theClass.monthlyAverages,
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Class {
    const data = snapshot.data(options)
    return new Class(
      snapshot.id,
      data.name,
      data.class,
      data.daily_averages,
      data.weekly_averages,
      data.monthly_averages
    )
  },
}
