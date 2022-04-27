import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
}

export default function Card({ children }: CardProps) {
  return <div className="rounded-lg bg-white p-4">{children}</div>
}
