import React, { useState, useEffect } from 'react'
import Glue, { Glue42 } from '@glue42/desktop'
import { Glue42Core } from '@glue42/core'
import { getIn, addLast, replaceAt } from 'timm'
import './App.css'
import { RoomList } from './components/RoomList'
import { MessageList } from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import { streamDataDataObjectProps, RoomProps } from './types/types'
import moment from 'moment'
var uniqid = require('uniqid')

declare global {
  interface Window {
    glue: Glue42.Glue
  }
}

const App: React.FC = () => {
  // TODO see if we can remove the glue variable
  let glue: Glue42.Glue | undefined
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [rooms, setRooms] = useState([
    {
      topic: 'test room topic',
      messages: [
        {
          id: 'unique id 1',
          author: 'Test Author',
          publicationTime: '2 days ago',
          text: 'text message example text',
        },
        {
          id: 'unique id 2',
          author: 'Test Author 2',
          publicationTime: '1 days ago',
          text: 'some random text',
        },
      ],
    },
    {
      topic: 'finance',
      messages: [
        {
          id: 'unique id 3',
          author: 'Finance Author',
          publicationTime: '5 days ago',
          text: 'finance text message',
        },
        {
          id: 'unique id 4',
          author: 'Finance Author 2',
          publicationTime: '7 days ago',
          text: 'finance text',
        },
      ],
    },
  ])

  useEffect(() => {
    Glue({ agm: true }).then((glueFromFactory: Glue42.Glue) => {
      glue = glueFromFactory
      window.glue = glueFromFactory
    })
  }, [glue])

  const sendMessage = (text: string) => {
    if (window.glue && window.glue.agm) {
      window.glue.agm
        .invoke('Glue42.Chat.Send.Message', {
          messageText: text,
          publicationTime:
            // @ts-ignore
            console.log(moment().format()) || moment().format(),
          room: selectedRoomId,
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

  const updateMessageData = ({
    streamData,
    roomId,
  }: {
    streamData: Glue42Core.Interop.StreamData
    roomId: string
  }) => {
    setRooms(prevRooms => {
      const data = streamData.data as streamDataDataObjectProps
      const id = uniqid()

      const currRoomIndex = prevRooms.findIndex(room => room.topic === roomId)

      const newMessagesForGivenRoom = addLast(
        getIn(prevRooms, [currRoomIndex, 'messages']),
        {
          id,
          author: data.messageAuthor,
          publicationTime: data.publicationTime,
          text: data.messageText,
        }
      )
      const newRooms = replaceAt(prevRooms, currRoomIndex, {
        topic: roomId,
        messages: newMessagesForGivenRoom,
      })

      return newRooms
    })
  }

  const currRoom = rooms.find(room => room.topic === selectedRoomId)

  const onRoomTopicClick = (room: RoomProps) => {
    console.log('TCL: onClick of room with topic: ', room.topic)
    setSelectedRoomId(room.topic)

    if (window && window.glue && window.glue.agm) {
      window.glue.agm
        .subscribe('Glue42.Chat', {
          arguments: { room: room.topic, username: 'Koceto' },
          target: 'all',
        })
        .then(streamSubscription =>
          streamSubscription.onData(
            (streamData: Glue42Core.Interop.StreamData) =>
              updateMessageData({ streamData, roomId: room.topic })
          )
        )
        .catch(error => {
          console.error('TCL: error', error)
          // subscription rejected or failed
        })
    }
  }

  return (
    <div className="app">
      <RoomList
        rooms={rooms}
        onRoomTopicClick={onRoomTopicClick}
        selectedRoomId={selectedRoomId}
      />
      <MessageList
        selectedRoomId={selectedRoomId}
        messages={currRoom && currRoom.messages}
      />
      <SendMessageForm disabled={!selectedRoomId} sendMessage={sendMessage} />
      {/* <NewRoomForm createRoom={this.createRoom} /> */}
    </div>
  )
}

export default App
