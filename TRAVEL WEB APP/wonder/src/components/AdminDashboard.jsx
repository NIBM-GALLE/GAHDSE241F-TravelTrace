import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Users Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Manage Users</Typography>
            <ul>
              <li>Search Users</li>
              <li>Add/Edit/Delete Users</li>
            </ul>
          </Paper>
        </Grid>

        {/* Locations Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Manage Locations</Typography>
            <ul>
              <li>Cities (Villages/Destinations)</li>
              <li>Districts</li>
              <li>Provinces</li>
            </ul>
          </Paper>
        </Grid>

        {/* Content Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Manage Content</Typography>
            <ul>
              <li>Images</li>
              <li>Videos</li>
              <li>Text</li>
            </ul>
          </Paper>
        </Grid>

        {/* Trails Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Manage Trails</Typography>
            <ul>
              <li>Search Trails</li>
              <li>Add/Edit/Delete Trails</li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
