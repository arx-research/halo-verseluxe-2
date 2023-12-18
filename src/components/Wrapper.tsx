import React from 'react'

interface IProps {
  children: React.ReactNode
}

export default function Wrapper({ children }: IProps) {
  return <div className="wrapper">{children}</div>
}
