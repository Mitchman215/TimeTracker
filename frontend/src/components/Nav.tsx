import { Link } from 'react-router-dom'
import clock from '../images/clock.png'

export default function Nav() {
  return (
    <nav className="flex justify-between items-center">
      <Link to="/" className="btn-white">
        Brown Hours Tracking
      </Link>
      <div className="bg-white rounded-full w-12 h-12 mr-32">
        <img src={clock} />
      </div>
      <Link to="/timer" className="btn-white">
        Timer
      </Link>
    </nav>
  )
}
