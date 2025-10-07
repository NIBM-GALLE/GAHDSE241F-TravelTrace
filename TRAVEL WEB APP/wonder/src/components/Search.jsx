import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';
import Navbar from './Navbar';

const categories = ['All', 'Hiking', 'Biking', 'Running', 'Walking', 'Camping'];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trails, setTrails] = useState([]);
  const [filteredTrails, setFilteredTrails] = useState([]);

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/trails');
        setTrails(response.data);
        setFilteredTrails(response.data);
      } catch (error) {
        console.error('Error fetching trails:', error);
      }
    };

    fetchTrails();
  }, []);

  useEffect(() => {
    let filtered = trails;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((trail) => trail.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (trail) =>
          trail.name.toLowerCase().includes(query) ||
          trail.short_description.toLowerCase().includes(query)
      );
    }

    setFilteredTrails(filtered);
  }, [selectedCategory, searchQuery, trails]);

  return (
    <>
      <Navbar />

      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pt: 14, pb: 7 }}>
        <Container maxWidth="md">
          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search trails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Category Filter */}
          <TextField
            select
            fullWidth
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ mb: 4 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          {/* Trail List */}
          <Grid container spacing={3}>
            {filteredTrails.length > 0 ? (
              filteredTrails.map((trail) => (
                <Grid item xs={12} sm={6} md={4} key={trail.trail_id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 6 },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={trail.photo_url || '/default-trail.jpg'}
                      alt={trail.name}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {trail.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {trail.short_description}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        Category: {trail.category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center">
                  No trails found matching your criteria.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Search;
