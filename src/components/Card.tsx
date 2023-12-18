import React from 'react'
import classNames from 'classnames'

interface IProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className }: IProps) {
  return <div className={classNames('card', className)}>{children}</div>
}
