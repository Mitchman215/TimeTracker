import { Link } from 'react-router-dom'
import clock from '../images/clock.png'

export default function Nav() {
  return (
    <nav className="flex justify-between items-center">
      <Link to="/" className="btn-white">
        Brown Hours Tracking
      </Link>
      <Link to="/stopwatcher" className="btn-white">
      Start Studying
      </Link>
      <Link to="/timer" className="btn-white">
        Timer
      </Link>
    </nav>
  )
}
