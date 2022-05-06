import { User } from 'firebase/auth'
import StopWatch from '../components/timeTracker/StopWatch'

type StopwatchProps = {
  user: User
}

export default function Stopwatcher({ user }: StopwatchProps) {
  return (
    <main>
      <StopWatch user={user} />
    </main>
  )
}
