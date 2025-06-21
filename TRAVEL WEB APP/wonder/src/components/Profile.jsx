import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { PhotoCamera, Edit } from '@mui/icons-material';
import axios from 'axios';
import Navbar from './Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userTrails, setUserTrails] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        setEditForm({
          username: userData.username,
          email: userData.email,
          bio: userData.bio || ''
        });

        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/users/${userData.id}/trails`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserTrails(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = { ...user, profile_image_url: response.data.profile_image_url };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/users/${user.id}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedUser = { ...user, ...editForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setOpenEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar title="My Profile" backButton showBottomNav={false} />

      {/* Body Container */}
      <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pt: 10, pb: 7 }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            {/* Profile Avatar and Edit */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={user.profile_image_url}
                  alt={user.username}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: -8,
                    bgcolor: '#6B4EFF',
                    '&:hover': { bgcolor: '#5B3FEF' },
                  }}
                >
                  <PhotoCamera sx={{ color: 'white' }} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                  />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {user.username}
                </Typography>
                <IconButton onClick={() => setOpenEdit(true)} sx={{ ml: 1 }}>
                  <Edit />
                </IconButton>
              </Box>

              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {user.email}
              </Typography>
              <Typography color="text.secondary">
                {user.bio || 'No bio added yet'}
              </Typography>
            </Box>

            {/* Trails Section */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                My Trails
              </Typography>

              <Grid container spacing={2}>
                {userTrails.map((trail) => (
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
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ color: '#6B4EFF', borderColor: '#6B4EFF' }}
                          >
                            View on Map
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ color: '#6B4EFF', borderColor: '#6B4EFF' }}
                          >
                            Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={editForm.username}
            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Bio"
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
