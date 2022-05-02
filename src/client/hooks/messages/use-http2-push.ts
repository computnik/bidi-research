import { useState, useEffect, useCallback } from 'react'
import { CLIENT_ID } from '../../user'
import { Message, MessageHook } from './types'


const REQUEST_URL = `/api/http2-push?clientId=${CLIENT_ID}`
export const useHttp2Push: MessageHook = (initialMessages: Message[] = [], delay = 500) => {
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
    let reader
    const utf8Decoder = new TextDecoder('utf-8')
    let onlineStatus = false
    try {
      const res = await fetch(REQUEST_URL)
      reader = res.body?.getReader()
    } catch (e) {
      console.error('connection err', e)
    }
    let done
    onlineStatus = true
    do {
      let readerResponse
      try {
        readerResponse = await reader?.read()
      } catch (e) {
        console.error('reader failed', e)
        onlineStatus = false
        return
      }
      done = readerResponse?.done
      const chunk = utf8Decoder.decode(readerResponse?.value, { stream: true })
      if (chunk) {
        try {
          const json = JSON.parse(chunk)
          setMessages(json)
        } catch (e) {
          console.error('parse error', e)
        }
      }
      console.log('done', done)
    } while (done === false)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(getMessages, delay)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return {
    messages,
    sendMessage,
  }
}
