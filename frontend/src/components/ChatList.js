import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';

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

  if (loading) return <Typography>Loading chats...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', borderRight: { xs: 0 } }}>
      {chats.map(chat => (
        <ListItem button key={chat._id} onClick={() => onSelectChat(chat)}>
          <ListItemAvatar>
            <Avatar>{chat.firstName.charAt(0)}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${chat.firstName} ${chat.lastName}`}
            secondary={<Typography variant="body2" color="textSecondary">Last message preview...</Typography>}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default ChatList; 