import React from 'react'
import { RoomListProps } from '../types/types'
import { Glue42Core } from '@glue42/core'

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  selectedRoomId,
  switchSelectedRoom,
}) => {
  const orderedRooms = rooms.sort((a, b) => (b > a ? 1 : -1))

  return (
    <div className="rooms-list">
      <ul>
        <h3>Your rooms:</h3>
        {orderedRooms.map(room => {
          const active = room.topic === selectedRoomId ? 'active' : ''

          return (
            <li key={room.topic} className={'room ' + active}>
              <div
                className="link-button"
                onClick={() => {
                  console.log('TCL: onClick of room with topic: ', room.topic)
                  console.log('TCL: window.glue.agm', window.glue.agm)
                  switchSelectedRoom(room.topic)

                  if (window && window.glue && window.glue.agm) {
                    window.glue.agm
                      .subscribe('Glue42.Chat', {
                        arguments: { room: room.topic, username: 'Koceto' },
                        target: 'all',
                      })
                      .then(streamSubscription => {
                        console.log(
                          'TCL: streamSubscription',
                          streamSubscription
                        )
                        console.log(
                          'TCL: streamSubscription.arguments',
                          streamSubscription.requestArguments
                        )
                        // use streamSubscription
                        streamSubscription.onData(
                          (data: Glue42Core.Interop.StreamData) => {
                            console.log('TCL: data', data)
                          }
                        )
                      })
                      .catch(error => {
                        console.error('TCL: error', error)
                        // subscription rejected or failed
                      })
                  }
                }}
              >
                #{room.topic}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
