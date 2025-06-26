import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, ArrowForward, Security } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.role === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Welcome Back!
        </Typography>

        {/* ✅ USER LOGIN SECTION */}
        <Box component="form" onSubmit={handleUserLogin} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              )
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#6B4EFF',
              '&:hover': { bgcolor: '#5B3FEF' }
            }}
          >
            Sign In
          </Button>
        </Box>

        {/* ✅ ERROR DISPLAY */}
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {/* ✅ SIGN UP LINK */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Typography color="primary">Don't have an account? Sign Up</Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
