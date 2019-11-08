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
    if (message !== '') {
      sendMessage(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="send-message-form">
      <input
        disabled={disabled}
        onChange={handleChange}
        value={message}
        placeholder={
          disabled
            ? 'Join a room first in order to be able to type a message'
            : 'Type your message and hit ENTER'
        }
        type="text"
      />
    </form>
  )
}

export default SendMessageForm
