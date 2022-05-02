import * as React from 'react'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chat from '../components/chat'
import { useWebsocket } from '../hooks'

const WebSocketChat = () => {
  const { messages, sendMessage } = useWebsocket([])

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h4" gutterBottom>
        WebSocket Chat!
      </Typography>
      <Chat messages={messages} onSendMessage={sendMessage} />
    </Container>
  )
}

export default WebSocketChat
