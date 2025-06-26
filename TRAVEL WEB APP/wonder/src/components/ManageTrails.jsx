import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  CssBaseline,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';

const drawerWidth = 240;

const ManageTrails = () => {
  const [trails, setTrails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTrails();
  }, []);

  const fetchTrails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/trails', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrails(res.data);
    } catch (error) {
      console.error('Error fetching trails:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredTrails = trails.filter(
    (trail) =>
      (trail.name?.toLowerCase().includes(searchQuery) ||
      trail.category?.toLowerCase().includes(searchQuery) ||
      trail.short_description?.toLowerCase().includes(searchQuery))
  );

  const handleEdit = (trailId) => {
    console.log('Edit trail:', trailId);
    // Implement navigation to edit trail page or open a dialog
  };

  const handleDelete = async (trailId) => {
    if (window.confirm('Are you sure you want to delete this trail?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/trails/${trailId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchTrails();
      } catch (error) {
        console.error('Error deleting trail:', error);
      }
    }
  };

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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Manage Trails
          </Typography>

          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <SearchIcon />
            <TextField
              variant="outlined"
              placeholder="Search trails by name, category, or description"
              onChange={handleSearchChange}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => console.log('Add New Trail')}
            >
              Add New
            </Button>
          </Box>

          <Paper elevation={3} sx={{ p: 2, mb: 5 }}>
            <Typography variant="h6" gutterBottom>Trail List</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Photo</TableCell>
                    <TableCell>Video</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTrails.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">No trails found.</TableCell>
                    </TableRow>
                  ) : (
                    filteredTrails.map((trail) => (
                      <TableRow key={trail.trail_id}>
                        <TableCell>{trail.name}</TableCell>
                        <TableCell>{trail.category}</TableCell>
                        <TableCell>{trail.short_description}</TableCell>
                        <TableCell>{new Date(trail.trail_date).toLocaleDateString()}</TableCell>
                        <TableCell>{trail.trail_time}</TableCell>
                        <TableCell>
                          {trail.photo_url && (
                            <img src={`http://localhost:8080${trail.photo_url}`} alt="Trail Photo" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                          )}
                        </TableCell>
                        <TableCell>
                          {trail.video_url && (
                            <video src={`http://localhost:8080${trail.video_url}`} controls style={{ width: 50, height: 50, objectFit: 'cover' }} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(trail.trail_id)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(trail.trail_id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ManageTrails;
