import { useEffect, useState } from 'react'
import TimeTracker from '../components/timeTracker/TimeTracker'
import User, { getCurrentUser } from '../models/User'

// TODO: fix to better handle user (environment variable at top level?)
export default function Timetrack() {
  // temporary fix
  const [user, setUser] = useState<User>()
  useEffect(() => {
    getCurrentUser().then((u) => setUser(u))
  }, [])
  if (user === undefined) {
    return <></>
  }

  return (
    <main>
      <TimeTracker user={user} />
    </main>
  )
}
