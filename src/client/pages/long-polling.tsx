import * as React from 'react'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chat from '../components/chat'
import { useLongPolling } from '../hooks'

const LongPolling = () => {
  const { messages, sendMessage } = useLongPolling([]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h4" gutterBottom>
        Long Polling Chat!
      </Typography>
      <Chat messages={messages} onSendMessage={sendMessage} />
    </Container>
  )
}

export default LongPolling
