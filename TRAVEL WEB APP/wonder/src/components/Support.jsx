import React from 'react';
import { Container, Typography, Box, Link, Paper } from '@mui/material';
import Navbar from './Navbar';

const Support = () => (
  <>
    {/* Top Navbar with title and back button */}
    <Navbar title="Support" backButton showBottomNav={false} />

    {/* Main Content below Navbar */}
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: 10, // Push content below navbar
        pb: 5,
        px: 2,
        backgroundColor: '#F9F9FB',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
            Support
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph align="center">
            If you need assistance, we’re here to help! Reach out through the following:
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              📧 Email:{' '}
              <Link href="mailto:support@traveltrace.com" underline="hover">
                support@traveltrace.com
              </Link>
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              📞 Phone:{' '}
              <Link href="tel:+94123456789" underline="hover">
                +94-123-456-789
              </Link>
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              📍 Address: 123 Trail Street, Colombo, Sri Lanka
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            Our support team typically replies within 24 hours on business days.
          </Typography>
        </Paper>
      </Container>
    </Box>
  </>
);

export default Support;
