import React from 'react'
import classNames from 'classnames'

interface IProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function ContentDetail({ children, className, title }: IProps) {
  return (
    <div className={classNames('content-detail', className)}>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  )
}
