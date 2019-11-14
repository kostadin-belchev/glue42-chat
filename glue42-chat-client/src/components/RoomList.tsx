import React from 'react'
import { RoomListProps } from '../types/types'

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  selectedRoomId,
  onRoomTopicClick,
}) => {
  const orderedRooms = rooms.sort((a, b) => (b > a ? 1 : -1))

  return (
    <div className="rooms-list">
      <ul>
        <h3>Rooms:</h3>
        {orderedRooms.map(room => {
          const active = room.topic === selectedRoomId ? 'active' : ''

          return (
            <li key={room.topic} className={'room ' + active}>
              <div
                className="link-button"
                onClick={() => onRoomTopicClick(room)}
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
