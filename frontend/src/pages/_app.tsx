import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createInitialUserDoc, getUserDataRef } from '../models/User'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { auth } from '../firebase'
import SignInPage from '../components/SignInPage'

function MyApp({ Component, pageProps }: AppProps) {
  // the currently authenticated user, if there is one
  const [authUser, authLoading, authError] = useAuthState(auth)
  // when the logged in user changes, retrieve user doc and set it
  const [user, userLoading, userError] = useDocumentData(
    authUser ? getUserDataRef(authUser.uid) : undefined
  )

  if (user && user.email?.endsWith('@brown.edu')) {
    // SUCCESSFULLY SIGNED IN, SHOW REQUESTED PAGE
    return <Component {...pageProps} />
  } else if (user) {
    // user didn't have an email that ends with '@brown.edu'
    const message = 'Error: Please sign into your Brown Gmail Account!'
    return <SignInPage message={message} />
  } else if (authLoading || userLoading) {
    // still fetching user data
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <p>Loading...</p>
      </div>
    )
  } else if (authError || userError) {
    // error occured, log appropriate error
    if (authError) {
      console.error(authError.message)
      console.log({ authError })
    } else if (userError) {
      console.error(userError.message)
      console.log({ userError })
    }
    const message = 'Sign in error. Please try again.'
    return <SignInPage message={message} />
  } else if (authUser && authUser.email?.endsWith('@brown.edu')) {
    // first time logging in
    createInitialUserDoc(authUser)
    const message = 'Retrieving / creating user data'
    return <SignInPage message={message} />
  } else {
    // idk man
    return <SignInPage />
  }
}

export default MyApp
