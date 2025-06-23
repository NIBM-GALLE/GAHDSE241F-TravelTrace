import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Group,
  Map,
  ExitToApp,
  TravelExplore,
} from '@mui/icons-material';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveValue = () => {
    const path = location.pathname;
    switch (path) {
      case '/admin':
        return 0;
      case '/admin/users':
        return 1;
      case '/admin/trails':
        return 2;
      default:
        return 0;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        bgcolor: 'white',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: 1,
      }}
      elevation={3}
    >
      {/* ✅ Top Bar with Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          gap: 1,
        }}
      >
        <TravelExplore sx={{ color: '#6B4EFF' }} />
        <Typography variant="h6" sx={{ color: '#6B4EFF', fontWeight: 'bold' }}>
          Travel Trace Admin
        </Typography>
      </Box>

      {/* ✅ Bottom Navigation */}
      <BottomNavigation
        showLabels
        value={getActiveValue()}
        onChange={(event, newValue) => {
          switch (newValue) {
            case 0:
              navigate('/admin');
              break;
            case 1:
              navigate('/admin/users');
              break;
            case 2:
              navigate('/admin/trails');
              break;
            case 3:
              // Optional: add logout logic or redirection
              navigate('/');
              break;
            default:
              break;
          }
        }}
        sx={{
          '& .Mui-selected': {
            color: '#6B4EFF',
          },
          '& .MuiBottomNavigationAction-root': {
            minWidth: 60,
            flex: 1,
            py: 1,
          },
        }}
      >
        <BottomNavigationAction label="Dashboard" icon={<Dashboard />} />
        <BottomNavigationAction label="Users" icon={<Group />} />
        <BottomNavigationAction label="Trails" icon={<Map />} />
        <BottomNavigationAction label="Logout" icon={<ExitToApp />} />
      </BottomNavigation>
    </Paper>
  );
};

export default AdminNavbar;
