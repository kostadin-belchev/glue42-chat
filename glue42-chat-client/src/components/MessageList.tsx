import React, { useLayoutEffect, useRef } from 'react'
import Message from './Message'
import { MessageListProps } from '../types/types'
import moment from 'moment'

export const MessageList: React.FC<MessageListProps> = ({
  selectedRoomId,
  messages,
}) => {
  const messageListElement = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    if (messageListElement && messageListElement.current) {
      const shouldScrollToBottom =
        messageListElement.current.scrollTop +
          messageListElement.current.clientHeight +
          100 >=
        messageListElement.current.scrollHeight

      if (shouldScrollToBottom) {
        messageListElement.current.scrollTop =
          messageListElement.current.scrollHeight
      }
    }
  })

  if (!selectedRoomId) {
    return (
      <div className="message-list">
        <div className="join-room">&larr; Join a room!</div>
      </div>
    )
  }

  if (!messages) {
    return (
      <div className="message-list">
        <div className="join-room">No messages for this room</div>
      </div>
    )
  }

  return (
    <div ref={messageListElement} className="message-list">
      {messages.map(message => (
        <Message
          key={message.id}
          id={message.id}
          author={message.author}
          text={message.text}
          publicationTime={moment(message.publicationTime).fromNow()}
        />
      ))}
    </div>
  )
}
