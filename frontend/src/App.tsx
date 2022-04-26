import { Route, Routes } from 'react-router-dom'
//import SignInScreen from './auth'
import Nav from './components/Nav'
import Home from './routes/Home'
import Timer from './routes/Timer'
import SignIn from './routes/SignIn'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'

// some logic here to make sure Nav doesn't render unless logged in.
export default function App() {
  const [user, loading, error] = useAuthState(auth)

  return (
    <div className="bg-brown w-screen h-screen p-4">
      {user && (
        <>
          <header>
            <Nav />
          </header>
          <p>{user.email}</p>
        </>
      )}
      <main className="mt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="timer" element={<Timer />} />
          <Route path="auth" element={<SignIn />} />
        </Routes>
      </main>
    </div>
  )
}
