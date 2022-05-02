import { useState, useEffect, useCallback } from 'react'
import { CLIENT_ID } from '../../user'
import { Message, MessageHook } from './types'

export const useLongPolling: MessageHook = (initialMessages: Message[] = [], interval = 500) => {
  const [messages, setMessages] = useState(initialMessages)

  const sendMessage = useCallback(async (data: any) => {
    const res = await fetch(`/api/long-poll?clientId=${CLIENT_ID}&offset=${messages.length}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log(await res.json())
  }, [])

  // Memoizing this is important, as new function will be created everytime
  // @Todo: Use RequestAnimationFrame to leverage idle time!
  const getMessages = useCallback(async () => {
    let resVar: any
    try {
      const res = await fetch(`/api/long-poll?clientId=${CLIENT_ID}&offset=${messages.length}`)
      console.log(res)
      resVar = res.clone()
      const msgs = await res.json()
      console.log(msgs)
      setMessages(msgs)
    } catch (e) {
      console.log(await resVar.text())
      console.error('polling err', e)
    }
  }, [messages])

  useEffect(() => {
    const timeoutId = setTimeout(getMessages, interval)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [messages])

  return {
    messages,
    sendMessage,
  }
}
