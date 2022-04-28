import { Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './routes/Home'
import Stopwatcher from './routes/Stopwatcher'
import Timer from './routes/Timer'

export default function App() {
  return (
    <div className="bg-blue-light w-screen h-screen p-4">
      <header>
        <Nav />
      </header>
      <main className="mt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="timer" element={<Timer />} />
          <Route path="stopwatcher" element={<Stopwatcher />} />
        </Routes>
      </main>
    </div>
  )
}
