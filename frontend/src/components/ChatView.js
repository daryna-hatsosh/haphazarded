import React from 'react';
import { Box, Typography } from '@mui/material';

function ChatView({ chat }) {
  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f7f9fc' }}>
      <Typography variant="h4" gutterBottom>
        {chat.firstName} {chat.lastName}
      </Typography>
      <Typography variant="body1">Chat content goes here...</Typography>
    </Box>
  );
}

export default ChatView; 