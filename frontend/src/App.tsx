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
import React from 'react'
import Classes from './components/Classes'

// some logic here to make sure Nav doesn't render unless logged in.
export default function App() {
  const [user, loading, error] = useAuthState(auth)

  const UserContext = React.createContext({})

  if (user && user.email?.endsWith('@brown.edu')) {
    return (
      <UserContext.Provider value={user}>
        <div className="bg-blue-light w-screen h-screen p-4">
          <header>
            <Nav />
          </header>
          <main className="mt-8">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="timetracker" element={<Timetrack />} />
              <Route path="auth" element={<Navigate replace to="/" />} />
              <Route path="class" element={<Class />} />
              <Route path="data" element={<Classes />} />
              <Route
                path="class/:classId"
                element={<ClassRecords user={user} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </UserContext.Provider>
    )
  } else if (user) {
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
