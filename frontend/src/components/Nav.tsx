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
          <div className="text-center">
            <div className="bg-white rounded-full w-12 h-12 m-auto mb-2">
              <img src={String(clock)} />
            </div>
            <div className="btn-white">Start Studying</div>
          </div>
        </Link>
      </div>
      <div className="flex justify-end col-span-1 items-center">
        <div className="grid grid-rows-3 grid-cols-2 xl:grid-rows-2 xl:grid-cols-3 gap-4 text-center items-center">
          <Link to="/records" className="btn-white items-center">
            Records
          </Link>
          <Link to="/departments" className="btn-white">
            Departments
          </Link>
          <button onClick={logout} className="btn-white">
            Logout
          </button>
          <Link to="/classes" className="btn-white">
            Classes
          </Link>
          <Link to="/user" className="btn-white">
            Comparison
          </Link>
        </div>
      </div>
    </nav>
  )
}
