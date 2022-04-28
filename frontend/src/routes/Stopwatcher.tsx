import StopWatch from '../components/StopWatch'

export default function Stopwatcher() {
  return (
    <main>
      <StopWatch
        totalDuration={25 * 60}
        onExpire={() => console.log('TIMER DONE')}
      />
    </main>
  )
}
