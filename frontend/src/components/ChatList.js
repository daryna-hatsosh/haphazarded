import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@mui/material';

function ChatList({ chats, onSelectChat }) {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {chats.map(chat => (
        <React.Fragment key={chat._id}>
          <ListItem button="true" onClick={() => onSelectChat(chat)}>
            <ListItemAvatar>
              <Avatar>{chat.firstName.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{`${chat.firstName} ${chat.lastName}`}</Typography>}
              secondary={<Typography variant="body2" color="textSecondary">Last message preview...</Typography>}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}

export default ChatList; 