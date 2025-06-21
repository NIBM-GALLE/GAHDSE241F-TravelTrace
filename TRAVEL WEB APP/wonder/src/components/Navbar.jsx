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
  Home,
  Search,
  AddCircle,
  Person,
  HelpOutline,
  Info,
  TravelExplore,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveValue = () => {
    const path = location.pathname;
    switch (path) {
      case '/home':
      case '/':
        return 0;
      case '/search':
        return 1;
      case '/create-trail':
        return 2;
      case '/profile':
        return 3;
      case '/about':
        return 4;
      case '/support':
        return 5;
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
      {/* Top Title Bar */}
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
          Travel Trace
        </Typography>
      </Box>

      {/* Full Navigation */}
      <BottomNavigation
        showLabels
        value={getActiveValue()}
        onChange={(event, newValue) => {
          switch (newValue) {
            case 0:
              navigate('/home');
              break;
            case 1:
              navigate('/search');
              break;
            case 2:
              navigate('/create-trail');
              break;
            case 3:
              navigate('/profile');
              break;
            case 4:
              navigate('/about');
              break;
            case 5:
              navigate('/support');
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
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Search" icon={<Search />} />
        <BottomNavigationAction label="Create" icon={<AddCircle />} />
        <BottomNavigationAction label="Profile" icon={<Person />} />
        <BottomNavigationAction label="About" icon={<Info />} />
        <BottomNavigationAction label="Support" icon={<HelpOutline />} />
      </BottomNavigation>
    </Paper>
  );
};

export default Navbar;
