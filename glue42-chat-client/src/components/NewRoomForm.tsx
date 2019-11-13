import React, { useState, ChangeEvent, FormEvent } from 'react'
import { NewRoomFormProps } from '../types/types'

export const NewRoomForm: React.FC<NewRoomFormProps> = ({ createRoom }) => {
  const [roomName, setRoomName] = useState('')

  const handleChange = (e: ChangeEvent) => {
    // @ts-ignore
    setRoomName(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    createRoom(roomName)
    setRoomName('')
  }

  return (
    <div className="new-room-form">
      <form onSubmit={handleSubmit}>
        <input
          value={roomName}
          onChange={handleChange}
          type="text"
          placeholder="Create a room"
          required
        />
        <button id="create-room-btn" type="submit">
          Create Room
        </button>
      </form>
    </div>
  )
}
