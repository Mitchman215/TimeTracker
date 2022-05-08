import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import clock from '../images/clock.png'

export default function Nav() {
  function logout() {
    auth.signOut()
    localStorage.clear()
    window.location.href = '/'
  }
  return (
    <nav className="grid grid-cols-3 grid-rows-1 items-center">
      <div className="flex justify-start col-span-1">
        <Link to="/" className="btn-white">
          Brown Hours Tracking
        </Link>
      </div>
      <div className="flex justify-center col-span-1">
        <Link to="/timetracker">
          <div className="bg-white rounded-full w-12 h-12">
            <img src={clock} />
          </div>
        </Link>
      </div>
      <div className="flex justify-end col-span-1">
        <Link to="/timetracker" className="btn-white">
          Start Studying
        </Link>
      </div>
      <div className="flex justify-end col-span-3">
        <div>
          <button onClick={logout} className="btn-white">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
