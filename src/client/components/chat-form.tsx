import React, { useState } from 'react'
import TextField from '@mui/material/TextField'

import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import AccountCircle from '@mui/icons-material/AccountCircle'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'
const defaultValues = {
  username: '',
  message: '',
}
const ChatForm = ({ onSendMessage = (data: any) => console.log(JSON.stringify(data)) }) => {
  const [formValues, setFormValues] = useState(defaultValues)
  // @ts-ignore
  const handleInputChange = (e) => {
    const { name, value } = e.target
    e.preventDefault()
    setFormValues({
      ...formValues,
      [name]: value,
    })
  }
  return (
    <Paper elevation={5} component="form" noValidate autoComplete="off">
      <Box
        display="grid"
        padding={3}
        gap="10px 10px"
        gridTemplateAreas={`
        "send-msg-title send-msg-title send-msg-title send-msg-title send-msg-title send-msg-title send-msg-title"
        "username-input username-input username-input username-input username-input username-input send-msg-btn"
        "message-input message-input message-input message-input message-input message-input send-msg-btn"
        "message-input message-input message-input message-input message-input message-input clear-msg-btn"
        "message-input message-input message-input message-input message-input message-input clear-msg-btn"`}
      >
        <Typography variant="h6" component="h6" alignSelf="center" gridArea="send-msg-title" gutterBottom>
          Send a Message to Server:
        </Typography>
        <Box alignSelf="center" gridArea="username-input">
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            fullWidth
            variant="filled"
            id="username-input"
            name="username"
            label="User Name"
            size="small"
            type="text"
            value={formValues.username}
            onChange={handleInputChange}
          />
        </Box>
        <Box alignSelf="center" gridArea="message-input">
          <TextField
            id="message-input"
            name="message"
            label="Message"
            size="small"
            type="textarea"
            multiline
            fullWidth
            minRows={4}
            value={formValues.message}
            onChange={handleInputChange}
            variant="filled"
          />
        </Box>
        <Box alignSelf="center" gridArea="send-msg-btn">
          <IconButton
            size="large"
            color="info"
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              onSendMessage(formValues)
              setFormValues(defaultValues)
            }}
          >
            <SendIcon sx={{ width: 40, height: 40 }} />
          </IconButton>
        </Box>
        <Box alignSelf="center" gridArea="clear-msg-btn">
          <IconButton
            size="large"
            color="error"
            type="reset"
            onClick={(e) => {
              e.preventDefault()
              setFormValues(defaultValues)
            }}
          >
            <DeleteIcon sx={{ width: 40, height: 40 }} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}
export default ChatForm
