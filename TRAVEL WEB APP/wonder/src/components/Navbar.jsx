import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Search, AddCircle, Person } from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveValue = () => {
    const path = location.pathname;
    if (path === '/home' || path === '/') return 0;
    if (path === '/search') return 1;
    if (path === '/create-trail') return 2;
    if (path === '/profile') return 3;
    return 0;
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      elevation={3}
    >
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
            default:
              break;
          }
        }}
        sx={{
          '& .Mui-selected': {
            color: '#6B4EFF',
          },
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
          sx={{
            '&.Mui-selected': {
              '& .MuiSvgIcon-root': {
                color: '#6B4EFF',
              },
            },
          }}
        />
        <BottomNavigationAction
          label="Search"
          icon={<Search />}
          sx={{
            '&.Mui-selected': {
              '& .MuiSvgIcon-root': {
                color: '#6B4EFF',
              },
            },
          }}
        />
        <BottomNavigationAction
          label="Create"
          icon={<AddCircle />}
          sx={{
            '&.Mui-selected': {
              '& .MuiSvgIcon-root': {
                color: '#6B4EFF',
              },
            },
          }}
        />
        <BottomNavigationAction
          label="Profile"
          icon={<Person />}
          sx={{
            '&.Mui-selected': {
              '& .MuiSvgIcon-root': {
                color: '#6B4EFF',
              },
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navbar; 