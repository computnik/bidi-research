import { MessageEmitter, FETCH_MESSAGE_EVENT, RECEIVE_MESSAGE_EVENT } from './message-events'
const CircularBuffer = require('circular-buffer')

// set up a limited array
const messages = new CircularBuffer(50)
export const getMessages = (): BufferedMessage[] => {
  const result = messages.toarray()
  return result
}

export type Message = {
  username: string
  message: string
}

export type BufferedMessage = Message & { time: number }

export const pushMessage = ({ username, message }: Message): void => {
  const data = {
    username,
    message,
    time: Date.now(),
  }
  messages.enq(data)
  MessageEmitter.emit(RECEIVE_MESSAGE_EVENT, data)
}

// feel free to take out, this just seeds the server with at least one message
pushMessage({ username: 'foo', message: 'ping' })
pushMessage({ username: 'bar', message: 'pong' })
