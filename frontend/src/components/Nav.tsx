import { Link } from 'react-router-dom'
import clock from '../images/clock.png'

export default function Nav() {
  return (
    <nav className="flex justify-between items-center">
      <Link to="/" className="bg-white rounded-full p-2 text-brown font-bold">
        Brown Hours Tracking
      </Link>
      <div className="bg-white rounded-full w-12 h-12">
        <img src={clock} />
      </div>
      <Link to="/timer" className="bg-white rounded-full p-2 text-brown">
        Timer
      </Link>
      <Link to="/auth" className="bg-white rounded-full p-2 text-brown">
        Sign In
      </Link>
    </nav>
  )
}
