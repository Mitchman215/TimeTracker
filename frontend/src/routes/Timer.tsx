import TimerComponent from '../components/TimerComponent'

export default function Timer() {
  return (
    <main>
      <TimerComponent
        totalDuration={25 * 60}
        onExpire={() => console.log('TIMER DONE')}
      />
    </main>
  )
}
