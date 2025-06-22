import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Grid,
  Container
} from '@mui/material';
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
        const response = await axios.get('http://localhost:8080/api/trails');
        setTrails(response.data);
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

      {/* ✅ Full Background Image Section with Floating Cloud Description */}
      <Box
        sx={{
          width: '100%',
          height: '85vh',
          position: 'relative',
          backgroundImage: `url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* ✅ Description in Cloud-like Box */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '10%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            boxShadow: 6,
            borderRadius: '50% 50% 45% 55% / 55% 45% 55% 45%',
            p: 4,
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
            Create trails for your past, present, and future journeys by adding photos,
            videos and articles to your trail.
          </Typography>
        </Box>
      </Box>

      {/* ✅ Featured Trails */}
      <Container maxWidth="lg" sx={{ pt: 6, pb: 4 }}>
        <Box
          sx={{
            mb: 6,
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            p: 4,
            color: 'white',
            backgroundColor: '#333',
          }}
        >
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Featured Trails
          </Typography>

          {featuredTrails.map((trail) => (
            <Card
              key={trail.trail_id}
              onClick={() => handleTrailClick(trail.trail_id)}
              sx={{
                cursor: 'pointer',
                height: 300,
                position: 'relative',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={trail.photo_url || '/default-trail.jpg'}
                alt={trail.name}
                sx={{ opacity: 0.7 }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                }}
              >
                <Typography variant="h5">{trail.name}</Typography>
                <Typography variant="body2">{trail.short_description}</Typography>
              </Box>
            </Card>
          ))}
        </Box>

        {/* ✅ Popular Trails */}
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
                      boxShadow: 6,
                    },
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
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
