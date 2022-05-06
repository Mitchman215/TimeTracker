import { User } from 'firebase/auth'
import Classes from '../components/Classes'
import UserClasses from '../components/UserClasses'

type HomeProps = {
  user: User
}

export default function Home({ user }: HomeProps) {
  return (
    <>
      <UserClasses user={user} />
    </>
  )
}
