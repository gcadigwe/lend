import React from 'react'

type BaseEntry = {
  name: string
  value: string
}

type Props = {
  entry: BaseEntry
}

const Entry: React.FC<Props> = ({ entry }) => {
  return <div>Entry</div>
}

export default Entry
