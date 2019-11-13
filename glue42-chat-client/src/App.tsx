import React, { useState, useEffect } from 'react'
import Glue, { Glue42 } from '@glue42/desktop'
import { Glue42Core } from '@glue42/core'
import { getIn, addLast, replaceAt } from 'timm'
import './App.css'
import { RoomList } from './components/RoomList'
import { MessageList } from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import { NewRoomForm } from './components/NewRoomForm'
import { streamDataDataObjectProps, RoomProps } from './types/types'
import moment from 'moment'

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
      // get history from provider app
      if (glue && glue.agm) {
        glue.agm
          .invoke('Glue42.Chat.Send.Message', {
            id: '',
            messageText: 'never shown message',
            publicationTime: moment().format(),
            room: '',
          })
          .then(successResult => {
            const historyByTopicId = successResult.returned.historyByTopicId

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
    })
  }, [])

  const sendMessage = (text: string) => {
    if (window.glue && window.glue.agm) {
      window.glue.agm
        .invoke('Glue42.Chat.Send.Message', {
          messageText: text,
          publicationTime: moment().format(),
          room: selectedRoomId,
        })
        .then(successResult => {
          const historyByTopicId = successResult.returned.historyByTopicId

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
          arguments: { roomTopic: room.topic },
          target: 'all',
        })
        .then(streamSubscription =>
          streamSubscription.onData(
            (streamData: Glue42Core.Interop.StreamData) =>
              setRooms(prevRooms => {
                const {
                  id,
                  author,
                  publicationTime,
                  text,
                } = streamData.data as streamDataDataObjectProps

                const currRoomIndex = prevRooms.findIndex(
                  prevRoom => prevRoom.topic === room.topic
                )

                const newMessagesForGivenRoom = addLast(
                  getIn(prevRooms, [currRoomIndex, 'messages']),
                  {
                    id,
                    author,
                    publicationTime,
                    text,
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

  const createRoom = (name: string) => {
    console.log('TCL: createRoom -> name', name)
    // TODO
    // this.currentUser.createRoom({
    //     name
    // })
    // .then(room => this.subscribeToRoom(room.id))
    // .catch(err => console.log('error with createRoom: ', err))
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
      <NewRoomForm createRoom={createRoom} />
    </div>
  )
}

export default App
