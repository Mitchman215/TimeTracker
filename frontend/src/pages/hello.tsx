import Image from 'next/image'

export default function Hello() {
  return (
    <>
      <Image src="/clock.png" alt="clock" width="64" height="64" />
      <h1>Hello world</h1>
    </>
  )
}
