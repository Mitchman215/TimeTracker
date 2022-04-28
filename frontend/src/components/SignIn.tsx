import { GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../firebase'

import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
//import firebase from "./firebase/clientApp";

// Configure FirebaseUI.S
const uiConfig = {
  // Redirect to / after sign in is successful.
  signInSuccessUrl: '/',
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
}

function SignInScreen() {
  return (
    <section className="bg-white rounded-lg p-4 place-content-center">
      <div
        style={{
          maxHeight: 'center',
          maxWidth: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 className="text-black font-bold size-10">Timer Tracker Login:</h1>
        <h1 className="text-black font-bold">
          Please sign in below using your Brown Gmail account
        </h1>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    </section>
  )
}

export default SignInScreen
