import React, { useContext } from 'react'
import NoteContext from '../context/noteContext'

export const About = () => {
const a=useContext(NoteContext)
  return (
    <div>
      <h1>about</h1>
      <p>{a.name} </p>
    </div>
  )
}
