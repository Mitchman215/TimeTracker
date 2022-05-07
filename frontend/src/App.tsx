import { Navigate, Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './routes/Home'
import Timetrack from './routes/Timetrack'
import Class from './routes/Class'
import ClassRecords from './routes/ClassRecords'
import NotFound from './routes/NotFound'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import Classes from './components/Classes'
import { createInitialUserDoc, getUserDataRef } from './models/User'
import UserContext from './models/UserContext'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import SignInPage from './components/SignInPage'

// some logic here to make sure Nav doesn't render unless logged in.
export default function App() {
  // the currently authenticated user, if there is one
  const [authUser, authLoading, authError] = useAuthState(auth)
  // when the logged in user changes, retrieve user doc and set it
  const [user, userLoading, userError] = useDocumentData(
    authUser ? getUserDataRef(authUser.uid) : undefined
  )

  if (user && user.email?.endsWith('@brown.edu')) {
    return (
      <UserContext.Provider value={user}>
        <div className="bg-blue-light w-screen h-screen p-4">
          <header>
            <Nav />
          </header>
          <main className="mt-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="timetracker" element={<Timetrack />} />
              <Route path="auth" element={<Navigate replace to="/" />} />
              <Route path="class" element={<Class />} />
              <Route path="data" element={<Classes />} />
              <Route path="class/:classId" element={<ClassRecords />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </UserContext.Provider>
    )
  } else if (user) {
    // user didn't have an email that ends with '@brown.edu'
    const message = 'Error: Please sign into your Brown Gmail Account!'
    return <SignInPage message={message} />
  } else if (authLoading || userLoading) {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <p>Loading...</p>
      </div>
    )
  } else if (authError || userError) {
    // log appropriate error
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
    createInitialUserDoc(authUser)
    const message = 'Retrieving / creating user data'
    return <SignInPage message={message} />
  } else {
    return <SignInPage />
  }
}
