import { useState, useEffect, useCallback } from 'react'
import { CLIENT_ID } from '../../user'
import { Message, MessageHook } from './types'

const REQUEST_URL = `/api/poll?clientId=${CLIENT_ID}`
export const usePolling: MessageHook = (initialMessages: Message[] = [], interval = 3000, delay = 500) => {
  const [messages, setMessages] = useState(initialMessages)
  const [isFirst, setIsFirst] = useState(true)

  const sendMessage = useCallback(async (data: any) => {
    const res = await fetch(REQUEST_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }, [])

  // Memoizing this is important, as new function will be created everytime
  // @Todo: Use RequestAnimationFrame to leverage idle time!
  const getMessages = useCallback(async () => {
    try {
      const res = await fetch(REQUEST_URL)
      const msgs = await res.json()
      setMessages(msgs)
    } catch (e) {
      console.error('polling err', e)
    }
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        getMessages()
        setIsFirst(false)
      },
      isFirst ? delay : interval,
    )
    return () => {
      clearTimeout(timeoutId)
    }
  }, [messages, isFirst])

  return {
    messages,
    sendMessage,
  }
}
