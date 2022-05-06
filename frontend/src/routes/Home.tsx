import UserClasses from '../components/UserClasses'
import User from '../models/User'

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
