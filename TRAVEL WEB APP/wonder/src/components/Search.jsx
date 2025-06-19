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
        const response = await axios.get('http://localhost:5000/api/trails');
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

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(trail => trail.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trail =>
        trail.name.toLowerCase().includes(query) ||
        trail.short_description.toLowerCase().includes(query)
      );
    }

    setFilteredTrails(filtered);
  }, [selectedCategory, searchQuery, trails]);

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 7 }}>
      <Container maxWidth="sm" sx={{ pt: 2 }}>
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

        <TextField
          select
          fullWidth
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ mb: 3 }}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>

        <Grid container spacing={2}>
          {filteredTrails.map((trail) => (
            <Grid item xs={12} key={trail.trail_id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={trail.photo_url || '/default-trail.jpg'}
                  alt={trail.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {trail.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {trail.short_description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Category: {trail.category}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Navbar />
    </Box>
  );
};

export default Search; 