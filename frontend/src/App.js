import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Box, useMediaQuery, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatList from './components/ChatList';
import ChatView from './components/ChatView';
import Login from './components/Login';
import Register from './components/Register';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';

function App() {
  const { user, token, logout } = useContext(AuthContext);
  const [selectedChat, setSelectedChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [chats, setChats] = useState([]);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const fetchChats = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setChats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRegisterOpen = () => setRegisterOpen(true);
  const handleRegisterClose = () => setRegisterOpen(false);

  const handleCreateChat = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chats`,
        { firstName, lastName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSelectedChat(response.data.data);
        handleClose();
        fetchChats();
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(chats.filter(chat => chat._id !== chatId));
      setSelectedChat(null);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  if (!user) {
    return (
      <Box sx={{ flexGrow: 1, bgcolor: '#f0f2f5', height: '100vh', overflow: 'hidden' }}>
        <AppBar position="static" sx={{ bgcolor: '#33658A' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Haphazarded
            </Typography>
            <Button color="inherit" onClick={handleRegisterOpen}>
              Register
            </Button>
          </Toolbar>
        </AppBar>
        <Login />
        <Dialog open={registerOpen} onClose={handleRegisterClose}>
          <DialogTitle>Register</DialogTitle>
          <DialogContent>
            <Register onClose={handleRegisterClose} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRegisterClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

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
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
          <Button color="inherit" onClick={handleOpen}>
            New Chat
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: 'calc(100vh - 64px)' }}>
        {isMobile ? (
          selectedChat ? (
            <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} onDelete={handleDeleteChat} />
          ) : (
            <ChatList chats={chats} onSelectChat={setSelectedChat} />
          )
        ) : (
          <>
            <Box sx={{ width: '30%', borderRight: '1px solid #ddd', overflow: 'auto', bgcolor: 'background.paper' }}>
              <ChatList chats={chats} onSelectChat={setSelectedChat} />
            </Box>
            {selectedChat ? (
              <ChatView chat={selectedChat} onDelete={handleDeleteChat} />
            ) : (
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                Select a chat to start messaging
              </Box>
            )}
          </>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateChat} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
