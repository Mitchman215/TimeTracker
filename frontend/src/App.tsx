import { Navigate, Route, Routes } from 'react-router-dom'
//import SignInScreen from './auth'
import Nav from './components/Nav'
import Home from './routes/Home'
import Timetrack from './routes/Timetrack'
import Class from './routes/Class'
import ClassRecords from './routes/ClassRecords'
import NotFound from './routes/NotFound'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import Auth from './routes/Auth'
import { useEffect, useState } from 'react'
import Classes from './components/Classes'
import User, { getOrCreateUser } from './models/User'
import UserContext from './models/UserContext'

// some logic here to make sure Nav doesn't render unless logged in.
export default function App() {
  const [authUser, loading, error] = useAuthState(auth)
  // when the logged in user changes, retrieve user doc and set it
  const [user, setUser] = useState<User>()
  useEffect(() => {
    console.log({ authUser })
    if (authUser) {
      // user is successfully logged in
      getOrCreateUser(authUser).then(setUser)
    } else {
      // no user logged in
      setUser(undefined)
    }
  }, [authUser])

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
  } else if (authUser) {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <header>
          <p>Error: Please sign into your Brown Gmail Account!</p>
        </header>
        <main className="mt-8">
          <Routes>
            <Route path="*" element={<Auth />} />
          </Routes>
        </main>
      </div>
    )
  } else if (loading) {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <p>Loading...</p>
      </div>
    )
  } else if (error) {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <header>
          <p>Sign in error. Please try again.</p>
        </header>
        <main className="mt-8">
          <Routes>
            <Route path="*" element={<Auth />} />
          </Routes>
        </main>
      </div>
    )
  } else {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <main className="mt-8">
          <Routes>
            <Route path="*" element={<Auth />} />
          </Routes>
        </main>
      </div>
    )
  }
}
