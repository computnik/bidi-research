import * as React from 'react'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chat from '../components/chat'
import { useServerSentEvents } from '../hooks'

const ServerSentEvents = () => {
  const { messages, sendMessage } = useServerSentEvents([])

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h4" gutterBottom>
        Server Sent Events!
      </Typography>
      <Chat messages={messages} onSendMessage={sendMessage} />
    </Container>
  )
}

export default ServerSentEvents
