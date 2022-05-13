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
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { defaultPomSettings, PomSettings } from './PomSettings'
import { User as AuthUser } from 'firebase/auth'
import UserClass, { classConverter } from './UserClass'
import UserRecord from './UserRecord'

// Represents a user's data. Mirrors user data in firestore
export default class User {
  readonly recordsRef: CollectionReference<DocumentData>

  // depreciated, use typedClassesRef
  readonly classesRef: CollectionReference<DocumentData>
  // only dependency in UserRecordsRoute

  readonly typedClassesRef: CollectionReference<UserClass>

  constructor(
    readonly uid: string,
    readonly email: string | null,
    readonly pomSettings: PomSettings = defaultPomSettings
  ) {
    this.recordsRef = collection(db, 'users', this.uid, 'records')
    this.classesRef = collection(db, 'users', this.uid, 'classes')
    this.typedClassesRef = this.classesRef.withConverter(classConverter)
  }

  toString(): string {
    return `User with email ${this.email}`
  }

  // add more functions here for adding records, classes, changing settings, etc.
  // also ideally have functions for retrieving subcollections, maybe implementing caching

  // save a record of a study session to the firestore db
  async logRecord(
    classId: string,
    startTime: Date,
    timeStudied: number,
    assignment?: string
  ) {
    const finishTime = new Date()
    console.log(`Logging new record for the class "${classId}`)
    const docToAdd: UserRecord = {
      class: doc(db, 'classes', classId),
      class_name: classId,
      start: startTime,
      finish: finishTime,
      duration: timeStudied,
    }
    if (assignment && assignment.length !== 0) {
      docToAdd.assignment = assignment
    }
    console.log({ docToAdd })
    await addDoc(this.recordsRef, docToAdd)
  }

  // returns the ids of all the classes a user is taking
  async getClasses(): Promise<string[]> {
    console.log('getting classes')
    const docs = await getDocs(query(this.typedClassesRef))
    const classes = docs.docs.map((s) => s.id)
    console.log({ classes })
    return classes
  }

  async addClass(classId: string, className: string) {
    // TODO: implement with code from UserClasses
    // TODO: refactor UserClasses to use this new function
    console.log(`request made to add class "${classId}", not implemented yet`)
  }

  // delete class from user's classes subcollection
  async deleteClass(classId: string) {
    console.log(`Deleting ${classId} from user's classes`)
    return deleteDoc(doc(db, this.typedClassesRef.path, classId))
    // note: cloud function should deal with deleting all the user's records for that class
  }

  // saves new settings to firestore
  async saveNewSettings(newSettings: PomSettings) {
    return updateDoc(doc(db, 'users', this.uid), {
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
