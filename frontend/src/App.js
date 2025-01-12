import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import ChatList from './components/ChatList';
import ChatView from './components/ChatView';

function App() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#33658A' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Haphazarded
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <ChatList onSelectChat={setSelectedChat} />
        {selectedChat ? (
          <ChatView chat={selectedChat} />
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
            Select a chat to start messaging
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
