import React, { FormEvent, useState, ChangeEvent } from 'react'
import { SendMessageFormProps } from '../types/types'

export const SendMessageForm: React.FC<SendMessageFormProps> = ({
  disabled,
  sendMessage,
}) => {
  const [message, setMessage] = useState('')

  const handleChange = (e: ChangeEvent) => {
    // @ts-ignore
    setMessage(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="send-message-form">
      <input
        disabled={disabled}
        onChange={handleChange}
        value={message}
        placeholder="Type your message and hit ENTER"
        type="text"
      />
    </form>
  )
}

export default SendMessageForm
