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

moment.locale('en-gb')

declare global {
  interface Window {
    glue: Glue42.Glue
  }
}

const App: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [subscriptions, setSubscriptions] = useState<string[]>([])
  const [rooms, setRooms] = useState<RoomProps[]>([])

  useEffect(() => {
    Glue({ agm: true }).then((glue: Glue42.Glue) => {
      window.glue = glue
      const historyByTopicId: { [index: string]: RoomProps } = {
        testRoomTopic: {
          topic: 'testRoomTopic',
          messages: [
            {
              id: 'unique id 1',
              author: 'Test Author',
              publicationTime: '2019-11-06T10:45:18+02:00',
              text: 'text message example text',
            },
            {
              id: 'unique id 2',
              author: 'Test Author 2',
              publicationTime: '2019-11-07T10:45:18+02:00',
              text: 'some random text',
            },
          ],
        },
        finance: {
          topic: 'finance',
          messages: [
            {
              id: 'unique id 3',
              author: 'Finance Author',
              publicationTime: '2019-11-03T10:45:18+02:00',
              text: 'finance text message',
            },
            {
              id: 'unique id 4',
              author: 'Finance Author 2',
              publicationTime: '2019-11-02T10:45:18+02:00',
              text: 'finance text',
            },
          ],
        },
      }

      setRooms(
        Object.keys(historyByTopicId).map(topic => ({
          ...historyByTopicId[topic],
        }))
      )
    })
  }, [])

  const sendMessage = (text: string) => {
    if (window.glue && window.glue.agm) {
      window.glue.agm
        .invoke('Glue42.Chat.Send.Message', {
          id: uniqid(),
          messageText: text,
          publicationTime: moment().format(),
          room: selectedRoomId,
        })
        .then(successResult => {
          const historyByTopicId = successResult.returned.historyByTopicId
          console.log('TCL: sendMessage -> historyByTopicId', historyByTopicId)
          setRooms(
            Object.keys(historyByTopicId).map(topic => ({
              ...historyByTopicId[topic],
            }))
          )
        })
        .catch(err => {
          console.error(
            `Failed to execute Glue42.Chat.Send.Message ${err.message}`
          )
        })
    }
  }

  const onRoomTopicClick = (room: RoomProps) => {
    setSelectedRoomId(room.topic)

    setSubscriptions(prevSubscriptions => prevSubscriptions.concat(room.topic))
    const isFirstLoadOfTopic = !subscriptions.includes(room.topic)

    if (window && window.glue && window.glue.agm && isFirstLoadOfTopic) {
      window.glue.agm
        .subscribe('Glue42.Chat', {
          arguments: { room: room.topic, username: 'Koceto' },
          target: 'all',
        })
        .then(streamSubscription =>
          streamSubscription.onData(
            (streamData: Glue42Core.Interop.StreamData) =>
              setRooms(prevRooms => {
                const data = streamData.data as streamDataDataObjectProps
                const id = uniqid()

                const currRoomIndex = prevRooms.findIndex(
                  prevRoom => prevRoom.topic === room.topic
                )

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
                  topic: room.topic,
                  messages: newMessagesForGivenRoom,
                })

                return newRooms
              })
          )
        )
        .catch(error => {
          console.error('TCL: error', error)
          // subscription rejected or failed
        })
    }
  }

  const currRoom = rooms.find(room => room.topic === selectedRoomId)

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
