import React from 'react'
import { MessageProps } from '../types/types'

export const Message: React.FC<MessageProps> = ({
  author,
  text,
  publicationTime,
}) => {
  return (
    <div className="message">
      <div className="message-username">
        {author} - <i>{publicationTime}</i>
      </div>
      <div className="message-text">{text}</div>
    </div>
  )
}

export default Message
