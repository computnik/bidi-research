import { useState, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'
const socket = io({ autoConnect: false, transports: ['websocket'] })

import { Message, MessageHook } from './types'

export const useWebsocket: MessageHook = (initialMessages: Message[] = [], delay = 500) => {
  const [messages, setMessages] = useState(initialMessages)

  const sendMessage = useCallback(async (data: any) => {
    socket.emit('messages:post', data)
  }, [])

  // Memoizing this is important, as new function will be created everytime
  // @Todo: Use RequestAnimationFrame to leverage idle time!
  const getMessages = useCallback(async () => {
    socket.emit('messages:fetch')
  }, [])

  useEffect(() => {
    socket.on('messages:get', (data) => {
      setMessages(data)
    })
    return () => {
      socket.off('messages:get')
    }
  }, [])
  useEffect(() => {
    socket.connect()
    const timeoutId = setTimeout(getMessages, delay)
    return () => {
      clearTimeout(timeoutId)
      socket.disconnect()
    }
  }, [])

  return {
    messages,
    sendMessage,
  }
}
