import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  IconButton,
} from '@mui/material';
import { ArrowBack, PhotoCamera, Videocam } from '@mui/icons-material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import Navbar from './Navbar';

const categories = ['Hiking', 'Biking', 'Running', 'Walking', 'Camping'];

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  marginBottom: '20px',
  borderRadius: '8px',
};

const center = {
  lat: 7.8731,
  lng: 80.7718,
};

const CreateTrail = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    short_description: '',
    start_coordinates: '',
    end_coordinates: '',
    trail_date: '',
    trail_time: '',
    photo: null,
    video: null,
  });

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [isSettingStart, setIsSettingStart] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    setFormData({ ...formData, [type]: e.target.files[0] });
  };

  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      if (isSettingStart) {
        setStartLocation({ lat, lng });
        setFormData((prev) => ({
          ...prev,
          start_coordinates: `${lat}, ${lng}`,
        }));
      } else {
        setEndLocation({ lat, lng });
        setFormData((prev) => ({
          ...prev,
          end_coordinates: `${lat}, ${lng}`,
        }));
      }
    },
    [isSettingStart]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.start_coordinates || !formData.end_coordinates) {
      alert('Please set both start and end locations on the map.');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('short_description', formData.short_description);

    const [startLat, startLng] = formData.start_coordinates.split(',').map((c) => c.trim());
    const [endLat, endLng] = formData.end_coordinates.split(',').map((c) => c.trim());

    data.append('start_lat', startLat);
    data.append('start_lng', startLng);
    data.append('end_lat', endLat);
    data.append('end_lng', endLng);
    data.append('trail_date', formData.trail_date);
    data.append('trail_time', formData.trail_time);

    if (formData.photo) data.append('photo', formData.photo);
    if (formData.video) data.append('video', formData.video);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/trails', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/home');
    } catch (error) {
      console.error('Error creating trail:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pt: 14, pb: 7 }}>
        <Container maxWidth="sm">
          {/* Header Bar */}
          <Box
            sx={{
              bgcolor: 'white',
              p: 2,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6">Create Trail</Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Trail Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
              required
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Short Description"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              required
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Set Trail Coordinates
            </Typography>

            <LoadScript googleMapsApiKey="Enter Your API key here">
              <Box sx={{ mb: 2 }}>
                <Button
                  variant={isSettingStart ? 'contained' : 'outlined'}
                  onClick={() => setIsSettingStart(true)}
                  sx={{ mr: 1 }}
                >
                  Set Start Location
                </Button>
                <Button
                  variant={!isSettingStart ? 'contained' : 'outlined'}
                  onClick={() => setIsSettingStart(false)}
                >
                  Set End Location
                </Button>
              </Box>

              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={7.5}
                onClick={handleMapClick}
              >
                {startLocation && <Marker position={startLocation} label="S" />}
                {endLocation && <Marker position={endLocation} label="E" />}
              </GoogleMap>
            </LoadScript>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Upload Media
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                sx={{ flex: 1 }}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photo')}
                />
              </Button>

              <Button
                variant="outlined"
                component="label"
                startIcon={<Videocam />}
                sx={{ flex: 1 }}
              >
                Upload Video
                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                />
              </Button>
            </Box>

            <TextField
              fullWidth
              type="date"
              label="Trail Date"
              name="trail_date"
              value={formData.trail_date}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              type="time"
              label="Trail Time"
              name="trail_time"
              value={formData.trail_time}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: '#6B4EFF',
                '&:hover': { bgcolor: '#5B3FEF' },
              }}
            >
              Create Trail
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CreateTrail;
