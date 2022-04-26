import * as React from 'react'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const Home = () => {
  const [message, setMessage] = React.useState<String>('fetching...')
  React.useEffect(() => {
    async function fetchMessage() {
      let response = await fetch('/api/message')
      const msg = response.ok ? await response.text() : ''
      setMessage(msg)
    }
    fetchMessage()

    // return () => {}
  }, [])

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h2" gutterBottom>
          Boilerplate
        </Typography>
        <Typography variant="h4" component="h4" gutterBottom>
          Server Message : {message}
        </Typography>
      </Box>
    </Container>
  )
}

export default Home
