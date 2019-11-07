import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'
import { MessageListProps } from '../types/types'
import moment from 'moment'

export const MessageList: React.FC<MessageListProps> = ({
  selectedRoomId,
  messages,
}) => {
  useEffect(() => {
    
  })
  // componentWillUpdate() {
  //     const node = ReactDOM.findDOMNode(this)
  //     this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight
  // }

  // componentDidUpdate() {
  //     if (this.shouldScrollToBottom) {
  //         const node = ReactDOM.findDOMNode(this)
  //         node.scrollTop = node.scrollHeight
  //     }
  // }

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
    <div className="message-list">
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
