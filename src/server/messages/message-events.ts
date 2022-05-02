import { EventEmitter } from 'events'


export const MessageEmitter = new EventEmitter()

export const RECEIVE_MESSAGE_EVENT = "MESSAGE:RECEIVE"
export const FETCH_MESSAGE_EVENT = "MESSAGE:FETCH"
