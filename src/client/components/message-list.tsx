import * as React from 'react'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

export type MessageListItem = {
  username: string
  message: string
}

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}
function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0]}`,
  }
}

export default function MessageList({ messages }: { messages: MessageListItem[] }) {
  return (
    <Paper elevation={4} sx={{ '& > *': { p: '2ch' }, minHeight: 350 }}>
      <Typography variant="h6" component="h6" sx={{ width: '100%' }} gutterBottom>
        Messages from Server:
      </Typography>

      <List sx={{ width: '100%' }}>
        {messages.length === 0 && <LinearProgress />}
        {messages.map(({ username, message }, index) => (
          <React.Fragment key={'message-list-item-' + index}>
            {index > 0 && <Divider variant="inset" component="li" />}
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar {...stringAvatar(username)} />
              </ListItemAvatar>
              <ListItemText primary={username} secondary={message} />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  )
}
