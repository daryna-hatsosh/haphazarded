import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Typography, Paper, TextField, IconButton, Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { format, isToday } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';

// Custom hook for managing socket connections
function useChatSocket(chatId, token, setMessages) {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL, {
      query: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
      socketRef.current.emit('joinChat', chatId);
    });

    socketRef.current.on('message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.emit('leaveChat', chatId);
      socketRef.current.disconnect();
    };
  }, [chatId, token, setMessages]);

  return socketRef;
}

function ChatView({ chat, onBack, onDelete }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user, token } = useContext(AuthContext);
  const messagesEndRef = useRef();

  // Initialize socket connection
  useChatSocket(chat._id, token, setMessages);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${chat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setMessages(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chat._id, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempMessage = {
      _id: Date.now(),
      content: newMessage,
      userId: user.userId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setNewMessage('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/messages/${chat._id}`, {
        content: newMessage,
        userId: user.userId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMessages((prevMessages) => {
          const tempIndex = prevMessages.findIndex(msg => msg._id === tempMessage._id);
          if (tempIndex !== -1) {
            const updatedMessages = [...prevMessages];
            updatedMessages[tempIndex] = response.data.data;
            return updatedMessages;
          }
          return [...prevMessages, response.data.data];
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteChat = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/chats/${chat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(chat._id);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error deleting chat');
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleCloseSnackbar = () => {
    setErrorMessage('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return isToday(date) ? format(date, 'p') : format(date, 'P');
  };

  return (
    <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #ddd', bgcolor: '#f7f9fc' }}>
        {onBack && (
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar sx={{ bgcolor: '#33658A', mr: 2 }}>{chat.firstName.charAt(0)}</Avatar>
        <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          {chat.firstName} {chat.lastName}
        </Typography>
        <IconButton onClick={() => setOpenDeleteDialog(true)} sx={{ color: '#FF6B6B' }}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 2 }}>
        {messages.map((message) => (
          <Box
            key={message._id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.userId === user.userId ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                bgcolor: message.userId === user.userId ? '#e0f7fa' : '#f1f1f1',
                p: 1,
                borderRadius: 2,
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              <Typography variant="body1" sx={{ mb: 0.5 }}>{message.content}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {formatTimestamp(message.createdAt)}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderTop: '1px solid #ddd' }}>
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          fullWidth
          sx={{ mr: 1 }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this chat? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteChat} sx={{ color: '#FF6B6B' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ChatView; 