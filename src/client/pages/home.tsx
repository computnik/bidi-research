import * as React from 'react'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chat from '../components/chat'

const Home = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h2" gutterBottom>
          Use navigation above to open appropriate demo
        </Typography>
      </Box>
    </Container>
  )
}

export default Home
