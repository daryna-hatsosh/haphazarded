import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, useMediaQuery, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatList from './components/ChatList';
import ChatView from './components/ChatView';

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', height: '100vh', overflow: 'hidden' }}>
      <AppBar position="static" sx={{ bgcolor: '#33658A' }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Haphazarded Chats
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: 'calc(100vh - 64px)' }}>
        {isMobile ? (
          selectedChat ? (
            <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} />
          ) : (
            <ChatList onSelectChat={setSelectedChat} />
          )
        ) : (
          <>
            <Box sx={{ width: '30%', borderRight: '1px solid #ddd', overflow: 'auto', bgcolor: 'background.paper' }}>
              <ChatList onSelectChat={setSelectedChat} />
            </Box>
            {selectedChat ? (
              <ChatView chat={selectedChat} />
            ) : (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                Select a chat to start messaging
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default App;
