// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDW7Lr3SIj6U_1WnsCgMSYLX4S1pWyyFko',
  authDomain: 'time-tracker-669e3.firebaseapp.com',
  projectId: 'time-tracker-669e3',
  storageBucket: 'time-tracker-669e3.appspot.com',
  messagingSenderId: '486351436516',
  appId: '1:486351436516:web:d537a5878347c98d778af1',
  measurementId: 'G-PJH58SSPV0',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)
// connectFirestoreEmulator(db, 'localhost', 8080)
const auth = getAuth(app)

export { app, analytics, db, auth }
