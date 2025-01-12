import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@mui/material';

function ChatList({ onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chats`);
        setChats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) return <Typography sx={{ p: 2 }}>Loading chats...</Typography>;
  if (error) return <Typography sx={{ p: 2 }}>Error: {error}</Typography>;

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