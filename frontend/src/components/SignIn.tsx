import { GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../firebase'
import Image from 'next/image'
import StyledFirebaseAuth from './StyledFirebaseAuth'

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
          <Image
            src="/BrownLogo.png"
            alt="Brown University Logo"
            width="48"
            height="48"
          />
        </div>
        <div className="bg-white rounded-full w-12 h-20">
          <Image src="/clock.png" alt="clock" width="64" height="64" />
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
