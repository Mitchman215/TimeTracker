import { Link } from 'react-router-dom'
import clock from '../images/clock.png'

export default function Nav() {
  return (
    <nav className="grid grid-cols-3 grid-rows-1 items-center">
      <div className="flex justify-start col-span-1">
        <Link to="/" className="bg-white rounded-full p-2 text-brown font-bold">
          Brown Hours Tracking
        </Link>
      </div>
      <div className="flex justify-center col-span-1">
        <div className="bg-white rounded-full w-12 h-12">
          <img src={clock} />
        </div>
      </div>
      <div className="flex justify-end col-span-1">
        <Link to="/timer" className="bg-white rounded-full p-2 text-brown">
          Timer
        </Link>
      </div>
    </nav>
  )
}
