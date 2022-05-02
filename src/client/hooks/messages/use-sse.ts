import { useState, useEffect, useCallback } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'

import { CLIENT_ID } from '../../user'
import { Message, MessageHook } from './types'

const REQUEST_URL = `/api/sse?clientId=${CLIENT_ID}`

const abortController = new AbortController()

export const useServerSentEvents: MessageHook = (initialMessages: Message[] = [], delay = 500) => {
  const [messages, setMessages] = useState(initialMessages)

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
    await fetchEventSource('/api/sse', {
      signal: abortController.signal,
      onmessage(ev) {
        try {
          const data = JSON.parse(ev.data)
          setMessages(data)
        } catch (ex) {
          console.error(ex)
        }
      },
    })
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(getMessages, delay)
    return () => {
      clearTimeout(timeoutId)
      abortController.abort()
    }
  }, [])

  return {
    messages,
    sendMessage,
  }
}
