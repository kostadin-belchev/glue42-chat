export interface MessageProps {
  id: string
  author: string
  publicationTime: string
  text: string
}

export interface RoomProps {
  topic: string
  messages: MessageProps[]
}

export interface RoomListProps {
  rooms: RoomProps[]
  selectedRoomId: string
  switchSelectedRoom: (roomId: string) => void
}

export interface MessageListProps {
  selectedRoomId: string
  messages: MessageProps[]
}

export interface SendMessageFormProps {
  disabled: boolean
  sendMessage: (text: string) => void
}
