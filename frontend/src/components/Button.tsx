import { ReactNode } from 'react'

type ButtonProps = {
  children: ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button className="rounded-full bg-brown text-white p-2" onClick={onClick}>
      {children}
    </button>
  )
}
