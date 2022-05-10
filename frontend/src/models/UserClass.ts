import {
  doc,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'
import { db } from '../firebase'

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
// Note: doesn't have 'class' field because it is redundant, can just do
// `doc(db, 'classes', <classId>)`
export default class UserClass {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly dailyAverages: DayAverage[] = [],
    readonly weeklyAverages: WeekAverage[] = [],
    readonly monthlyAverages: MonthAverage[] = []
  ) {}
}

// Firestore data converter for Class
export const classConverter = {
  toFirestore(theClass: UserClass): DocumentData {
    return {
      id: theClass.id,
      name: theClass.name,
      class: doc(db, 'classes', theClass.id),
      daily_averages: theClass.dailyAverages,
      weekly_averages: theClass.weeklyAverages,
      monthly_averages: theClass.monthlyAverages,
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): UserClass {
    const data = snapshot.data(options)
    return new UserClass(
      snapshot.id,
      data.name,
      data.daily_averages,
      data.weekly_averages,
      data.monthly_averages
    )
  },
}
