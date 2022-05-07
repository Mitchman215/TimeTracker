import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  CollectionReference,
  DocumentData,
  addDoc,
  getDocs,
  doc,
  query,
  collection,
  setDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { defaultPomSettings, PomSettings } from './PomSettings'
import { User as AuthUser } from 'firebase/auth'

// Represents a user's data. Mirrors user data in firestore
export default class User {
  readonly recordsRef: CollectionReference<DocumentData>

  readonly classesRef: CollectionReference<DocumentData>

  constructor(
    readonly uid: string,
    readonly email: string | null,
    readonly pomSettings: PomSettings = defaultPomSettings
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

  // saves new settings to firestore
  async saveNewSettings(newSettings: PomSettings) {
    updateDoc(doc(db, 'users', this.uid), {
      pom_settings: newSettings,
    })
  }
}

export interface UserProp {
  user: User
}

// Firestore data converter for User
const userConverter = {
  toFirestore(user: User): DocumentData {
    const {
      workDuration: work,
      shortBreakDuration: sBreak,
      longBreakDuration: lBreak,
      pomsPerSet: numPoms,
    } = user.pomSettings
    return {
      email: user.email,
      pom_settings: {
        work_duration: work,
        short_break_duration: sBreak,
        long_break_duration: lBreak,
        poms_per_set: numPoms,
      },
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options)
    return new User(snapshot.id, data.email, data.pom_settings)
  },
}

export function getUserDataRef(userId: string) {
  return doc(db, 'users', userId).withConverter(userConverter)
}

/**
 * creates the initial user doc in the 'users' collection in firestore
 * if it doesn't exist already.
 * @param authUser the currently logged in and authenticated user auth object
 */
export async function createInitialUserDoc(authUser: AuthUser) {
  const userRef = getUserDataRef(authUser.uid)
  // check to make sure user doc doesn't already exist in the collection
  const initialSnapshot = await getDoc(userRef)
  if (!initialSnapshot.exists()) {
    // user doc does not exist in users collection, so create it
    console.log(`creating user doc for ${authUser.uid}`)
    await setDoc(doc(db, 'users', authUser.uid), {
      email: authUser.email,
      pom_settings: defaultPomSettings,
    })
  } else {
    console.log(`user doc for ${authUser.uid} exists already`)
  }
}
