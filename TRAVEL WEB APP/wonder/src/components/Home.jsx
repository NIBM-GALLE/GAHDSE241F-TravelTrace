import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Rating, Grid, Container } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Home = () => {
  const [trails, setTrails] = useState([]);
  const [featuredTrails, setFeaturedTrails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trails');
        setTrails(response.data);
        // Set first trail as featured for now
        if (response.data.length > 0) {
          setFeaturedTrails([response.data[0]]);
        }
      } catch (error) {
        console.error('Error fetching trails:', error);
      }
    };

    fetchTrails();
  }, []);

  const handleTrailClick = (trailId) => {
    navigate(`/trails/${trailId}`);
  };

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Featured Trails
          </Typography>
          
          <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
            {featuredTrails.map((trail) => (
              <Card 
                key={trail.trail_id}
                onClick={() => handleTrailClick(trail.trail_id)}
                sx={{ 
                  cursor: 'pointer',
                  height: 300,
                  position: 'relative'
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={trail.photo_url || '/default-trail.jpg'}
                  alt={trail.name}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    p: 2
                  }}
                >
                  <Typography variant="h5" component="div">
                    {trail.name}
                  </Typography>
                  <Typography variant="body2">
                    {trail.short_description}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Popular Trails
          </Typography>
          
          <Grid container spacing={3}>
            {trails.map((trail) => (
              <Grid item xs={12} key={trail.trail_id}>
                <Card 
                  onClick={() => handleTrailClick(trail.trail_id)}
                  sx={{ 
                    display: 'flex',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 140, height: 140 }}
                    image={trail.photo_url || '/default-trail.jpg'}
                    alt={trail.name}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {trail.name}
                      </Typography>
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
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 