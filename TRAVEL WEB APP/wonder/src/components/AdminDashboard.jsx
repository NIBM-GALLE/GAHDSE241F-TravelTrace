import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import AdminNavbar from './AdminNavbar';

const AdminDashboard = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f0f0' }}>
      <AdminNavbar />
      <Container sx={{ pt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Admin!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Use the top navigation bar to manage users and trails.
        </Typography>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
