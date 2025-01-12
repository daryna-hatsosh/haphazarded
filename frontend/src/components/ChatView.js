import React from 'react';
import { Box, Typography, Paper, TextField, IconButton, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

const messages = [
  { id: 1, text: 'Hello!', sender: 'other' },
  { id: 2, text: 'Hi there!', sender: 'self' },
  { id: 3, text: 'How are you?', sender: 'other' },
  { id: 4, text: 'I am good, thanks!', sender: 'self' },
];

function ChatView({ chat, onBack }) {
  return (
    <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #ddd', bgcolor: '#f7f9fc' }}>
        {onBack && (
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar sx={{ bgcolor: '#33658A', mr: 2 }}>{chat.firstName.charAt(0)}</Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {chat.firstName} {chat.lastName}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 2 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'self' ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                bgcolor: message.sender === 'self' ? '#e0f7fa' : '#f1f1f1',
                p: 1,
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderTop: '1px solid #ddd' }}>
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          fullWidth
          sx={{ mr: 1 }}
        />
        <IconButton color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default ChatView; 