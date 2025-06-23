import React from 'react';
import { Box, Typography, Container, Button, TextField, Grid } from '@mui/material';

const ManageTrails = () => {
  return (
    <Container sx={{ pt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Manage Trails
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField label="Search trails" variant="outlined" fullWidth />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" fullWidth>
            Add Trail
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" color="error" fullWidth>
            Delete Selected
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body1">Trail listing with Edit/Delete goes here...</Typography>
      </Box>
    </Container>
  );
};

export default ManageTrails;
