import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  CollectionReference,
  DocumentData,
  addDoc,
  getDocs,
  doc,
  getDoc,
  DocumentSnapshot,
  query,
  collection,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { defaultPomSettings, PomTimerSettings } from './PomTimerSettings'
import { User as AuthUser } from 'firebase/auth'

// Represents a user's data. Mirrors user data in firestore
export default class User {
  readonly recordsRef: CollectionReference<DocumentData>

  readonly classesRef: CollectionReference<DocumentData>

  constructor(
    readonly uid: string,
    readonly email: string | null,
    readonly pomTimerSettings: PomTimerSettings = defaultPomSettings
  ) {
    this.recordsRef = collection(db, 'users', this.uid, 'records')
    this.classesRef = collection(db, 'users', this.uid, 'classes')
  }

  toString(): string {
    return `User with email ${this.email}`
  }

  // add more functions here for adding records, classes, changing settings, etc.
  // also ideally have functions for retrieving subcollections, maybe implementing caching

  // save a record of a study session to the firestore db
  async logRecord(classId: string, startTime: Date, timeStudied: number) {
    const finishTime = new Date()
    console.log(`Logging new record for the class "${classId}`)
    console.log({ classId, startTime, timeStudied, finishTime })
    await addDoc(this.recordsRef, {
      // class: doc(db, 'classes', ref),
      class_name: classId,
      start: startTime,
      finish: finishTime,
      duration: timeStudied,
    })
  }

  // returns the ids of all the classes a user is taking
  async getClasses(): Promise<string[]> {
    console.log('getting classes')
    const docs = await getDocs(query(this.classesRef))
    const classes = docs.docs.map((s) => s.id)
    console.log({ classes })
    return classes
  }

  async enrollInExistingClass() {
    // todo: implement maybe
  }

  async saveNewSettings() {
    // todo: implement
  }
}

export interface UserProp {
  user: User
}

// Firestore data converter for User
const userConverter = {
  toFirestore(user: User): DocumentData {
    return {
      email: user.email,
      pom_timer_settings: {
        work_duration: user.pomTimerSettings.workDuration,
        short_break_duration: user.pomTimerSettings.shortBreakDuration,
        long_break_duration: user.pomTimerSettings.longBreakDuration,
        poms_per_set: user.pomTimerSettings.pomsPerSet,
      },
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options)
    return new User(snapshot.id, data.email, data.pom_timer_settings)
  },
}

// returns a User object that repersents the currently logged in user
export async function getCurrentUser() {
  // current user id, to be replaced
  const userId = 'QpDjNV8TwCqg1hWNNtE5'
  const userRef = doc(db, 'users', userId).withConverter(userConverter)
  const userSnap: DocumentSnapshot<User> = await getDoc(userRef)
  if (userSnap.exists()) {
    return userSnap.data()
  } else {
    throw new Error(`No user with uid "${userId}" exists in the database`)
  }
}

export async function getOrCreateUser(authUser: AuthUser) {
  const userRef = doc(db, 'users', authUser.uid).withConverter(userConverter)
  const userSnap: DocumentSnapshot<User> = await getDoc(userRef)
  if (userSnap.exists()) {
    return userSnap.data()
  } else {
    // user doc does not exist in users collection, so create it
    console.log(`creating user doc for ${authUser.uid}`)
    await setDoc(doc(db, 'users', authUser.uid), {
      email: authUser.email,
      pom_timer_settings: defaultPomSettings,
    })
    return new User(authUser.uid, authUser.email, defaultPomSettings)
  }
}
