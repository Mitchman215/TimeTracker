import { GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../firebase'
import clock from '../images/clock.png'
import logo from '../images/BrownLogo.png'
import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

// Configure FirebaseUI.S
const uiConfig = {
  // Redirect to / after sign in is successful.
  signInSuccessUrl: '/',
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
}

function SignIn() {
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
        <div className="text-black font-bold size-10 h-12">
          Time Tracker Login:
        </div>
        <div className="bg-white rounded-full w-12 h-12">
          <img src={logo} />
        </div>
        <div className="bg-white rounded-full w-12 h-20">
          <img src={clock} />
        </div>
        <h1 className="text-black font-bold h-12">
          Please sign in below using your Brown Gmail account
        </h1>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    </section>
  )
}

export default SignIn
