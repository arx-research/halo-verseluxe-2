import React from 'react'
import classNames from 'classnames'

interface IProps {
  className?: string
}

export default function Divider({ className }: IProps) {
  return <div className={classNames('divider', className)} />
}
