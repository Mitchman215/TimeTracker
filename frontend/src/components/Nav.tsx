import { Link } from 'react-router-dom'
import clock from '../images/clock.png'

export default function Nav() {
  return (
    <nav className="grid grid-cols-3 grid-rows-1 items-center">
      <div className="flex justify-start col-span-1">
        <Link to="/" className="btn-white">
          Brown Hours Tracking
        </Link>
      </div>
      <div className="flex justify-center col-span-1">
        <div className="bg-white rounded-full w-12 h-12">
          <img src={clock} />
        </div>
      </div>
      <div className="flex justify-end col-span-1">
        <Link to="/stopwatcher" className="btn-white">
          Start Studying
        </Link>
        <Link to="/timer" className="btn-white">
          Timer
        </Link>
      </div>
    </nav>
  )
}
