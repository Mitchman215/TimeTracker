import { Route, Routes } from 'react-router-dom'
//import SignInScreen from './auth'
import Nav from './components/Nav'
import Home from './routes/Home'
import Timer from './routes/Timer'
import Class from './routes/Class'
import ClassRecords from './routes/ClassRecords'
import NotFound from './routes/NotFound'
import SignIn from './components/SignIn'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import Auth from './routes/Auth'

// some logic here to make sure Nav doesn't render unless logged in.
export default function App() {
  const [user, loading, error] = useAuthState(auth)
  if (user && user.email?.endsWith('@brown.edu')) {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <>
          <header>
            <Nav />
          </header>
          <p>Hello {user.displayName}</p>
          <p>{user.email}</p>
        </>
        <main className="mt-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="timer" element={<Timer />} />
            <Route path="auth" element={<SignIn />} />
            <Route path="/class" element={<Class />} />
            <Route path="/class/:classId" element={<ClassRecords />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    )
  } else if (user) {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <>
          <p>Error: Please sign into your Brown Gmail Account!</p>
          <header>
            <Auth />
          </header>
        </>
        <main className="mt-8">
          <Routes>
            <Route path="auth" element={<SignIn />} />
          </Routes>
        </main>
      </div>
    )
  } else if (loading) {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <>
          <p>Loading...</p>
        </>
      </div>
    )
  } else if (error) {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <>
          <p>Sign in error. Please try again.</p>
          <header>
            <Auth />
          </header>
        </>
        <main className="mt-8">
          <Routes>
            <Route path="auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    )
  } else {
    return (
      <div className="bg-blue-light w-screen h-screen p-4">
        <>
          <header>
            <Auth />
          </header>
        </>
        <main className="mt-8">
          <Routes>
            <Route path="auth" element={<Auth />} />
          </Routes>
        </main>
      </div>
    )
  }
}
