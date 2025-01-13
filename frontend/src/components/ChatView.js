import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, IconButton, Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function ChatView({ chat, onBack, onDelete }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [chat]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${chat._id}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/messages/${chat._id}`, {
        content: newMessage,
        sender: 'self', // Assuming 'self' is the identifier for the current user
      });
      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error sending message');
    }
  };

  const handleDeleteChat = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/chats/${chat._id}`);
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
              <Typography variant="body1">{message.content}</Typography>
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
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>

      {/* Confirmation Dialog for Deletion */}
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

      {/* Snackbar for Error Messages */}
      <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ChatView; 