import React, { useState, useEffect } from 'react'
import Glue, { Glue42 } from '@glue42/desktop'
import './App.css'
import { RoomList } from './components/RoomList'
import { MessageList } from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'

declare global {
  interface Window {
    glue: Glue42.Glue
  }
}

const App: React.FC = () => {
  // TODO see if we can remove this variable
  let glue: Glue42.Glue | undefined
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'unique id 1',
      author: 'Author Author',
      publicationTime: '2 days ago',
      text: 'text message example text',
    },
    {
      id: 'unique id 2',
      author: 'Author Author 2',
      publicationTime: '1 days ago',
      text: 'some random text',
    },
  ])

  useEffect(() => {
    Glue({ agm: true }).then((glueFromFactory: Glue42.Glue) => {
      console.log('TCL: App:React.FC -> glueFromFactory', glueFromFactory)
      glue = glueFromFactory
      window.glue = glueFromFactory

      afterGlueInitialized()
    })
  }, [glue])

  const afterGlueInitialized = () => {
    console.log('TCL: afterGlueInitialized -> window.glue', window.glue)
  }

  const sendMessage = (text: string) => {
    // TODO
    console.log('TCL: text', text)
    console.log('TCL: sendMessage -> window.glue', window.glue)
    console.log('TCL: sendMessage -> window.glue.agm', window.glue!.agm)
    if (window.glue && window.glue.agm) {
      console.log('about to invoke')
      window.glue.agm
        .invoke('Glue42.Chat.Send.Message', {
          messageText: text,
          publicationTime: 'some publication time',
        })
        .then(successResult => {
          console.log(
            'TCL: sendMessage -> successResult.returned',
            successResult.returned
          )
        })
        .catch(err => {
          console.error(
            `Failed to execute Glue42.Chat.Send.Message ${err.message}`
          )
        })
    }
  }

  return (
    <div className="app">
      <RoomList
        switchSelectedRoom={setSelectedRoomId}
        rooms={[
          {
            topic: 'test room topic',
            messages,
          },
          {
            topic: 'finance',
            messages,
          },
        ]}
        selectedRoomId={selectedRoomId}
      />
      <MessageList selectedRoomId={selectedRoomId} messages={messages} />
      <SendMessageForm disabled={!selectedRoomId} sendMessage={sendMessage} />
      {/* <NewRoomForm createRoom={this.createRoom} /> */}
    </div>
  )
}

export default App
