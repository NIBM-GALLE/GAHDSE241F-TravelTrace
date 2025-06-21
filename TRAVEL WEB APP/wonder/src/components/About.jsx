import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import Navbar from './Navbar';

const About = () => (
  <>
    {/* Navbar with title and back button, no bottom nav */}
    <Navbar title="About" backButton showBottomNav={false} />

    {/* Body container with top padding to avoid overlapping with navbar */}
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: 10, // ensures space below fixed navbar
        pb: 5,
        px: 2,
        backgroundColor: '#F9F9FB',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
            About Travel Trace
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Travel Trace is your trusted companion for discovering and tracking beautiful trails
            in Sri Lanka and beyond. Whether you're an avid hiker, a nature lover, or just
            exploring, Travel Trace helps you document, share, and relive your trail experiences.
          </Typography>
        </Paper>
      </Container>
    </Box>
  </>
);

export default About;
