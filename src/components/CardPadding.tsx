import React from 'react'
import classNames from 'classnames'

interface IProps {
  children: React.ReactNode
  className?: string
}

export default function CardPadding({ children, className }: IProps) {
  return <div className={classNames('card-padding', className)}>{children}</div>
}
