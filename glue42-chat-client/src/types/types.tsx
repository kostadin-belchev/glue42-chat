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
  onRoomTopicClick: (room: RoomProps) => void
}

export interface MessageListProps {
  selectedRoomId: string
  messages?: MessageProps[]
}

export interface SendMessageFormProps {
  disabled: boolean
  sendMessage: (text: string) => void
}

export interface streamDataDataObjectProps {
  callerId: string
  messageAuthor: string
  messageText: string
  publicationTime: string
  room: string
}
