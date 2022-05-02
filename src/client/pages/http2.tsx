import * as React from 'react'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chat from '../components/chat'
import { useHttp2Push } from '../hooks'

const HTTP2Push = () => {
  const { messages, sendMessage } = useHttp2Push([])

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h4" gutterBottom>
        HTTP/2 Push Chat!
      </Typography>
      <Chat messages={messages} onSendMessage={sendMessage} />
    </Container>
  )
}

export default HTTP2Push
