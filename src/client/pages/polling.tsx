import * as React from 'react'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chat from '../components/chat'
import { usePolling } from '../hooks'

const Polling = () => {
  const { messages, sendMessage } = usePolling([])

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h4" gutterBottom>
        Polling Chat!
      </Typography>
      <Chat messages={messages} onSendMessage={sendMessage} />
    </Container>
  )
}

export default Polling
