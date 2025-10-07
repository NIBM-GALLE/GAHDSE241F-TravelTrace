import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Rating,
  CssBaseline,
} from '@mui/material';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import { LocationOn } from '@mui/icons-material';

const drawerWidth = 240;

const AdminDashboard = () => {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/trails');
        setTrails(res.data);
      } catch (err) {
        console.error('Error fetching trails:', err);
      }
    };
    fetchTrails();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ height: '64px' }} />

        <Box
          sx={{
            width: '100%',
            height: '85vh',
            backgroundImage: `url('/background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            mb: 4,
          }}
        />

        <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            All Trails
          </Typography>
          <Grid container spacing={3}>
            {trails.map((trail) => (
              <Grid item xs={12} md={6} key={trail.trail_id}>
                <Card sx={{ display: 'flex', cursor: 'pointer' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 140, height: 140 }}
                    image={trail.photo_url || '/default-trail.jpg'}
                    alt={trail.name}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6">{trail.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {trail.short_description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Rating value={4.5} precision={0.5} readOnly size="small" />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            2 km away
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
