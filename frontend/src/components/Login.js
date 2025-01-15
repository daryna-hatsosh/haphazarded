import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });
      login(response.data);
    } catch (error) {
      console.error('Email login failed', error);
      setError('Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Google login');
      // const userData = await loginWithGoogle();
      // login(userData);
    } catch (error) {
      console.error('Google login failed', error);
      setError('Google login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f0f2f5' }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          Login
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }} onClick={handleEmailLogin}>
          Login with Email
        </Button>
        <Button variant="outlined" color="secondary" fullWidth onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
