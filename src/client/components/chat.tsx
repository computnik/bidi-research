import * as React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ChatForm from '../components/chat-form'
import MessageList from '../components/message-list'

const INTERVAL = 3000

const postNewMsg = async (data) => {
  const res = await fetch('/api/poll', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(await res.json())
}

const Chat = ({
  messages = [
    { username: 'foo', message: 'ping' },
    { username: 'bar', message: 'pong' },
  ],
  onSendMessage = (data:any) => console.log(JSON.stringify(data)),
}) => {
  return (
    <Box>
      <MessageList messages={messages} />
      <Divider />
      <ChatForm onSendMessage={onSendMessage} />
    </Box>
  )
}

export default Chat
