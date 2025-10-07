import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  CssBaseline,
  Select,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';

const drawerWidth = 240;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/users?role=user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error.response || error.message);
      showSnackbar('Failed to fetch users', 'error');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery) ||
      user.email?.toLowerCase().includes(searchQuery)
  );

  const startEditing = (user) => {
    setEditUserId(user.user_id);
    setEditedUser({ ...user });
  };

  const cancelEditing = () => {
    setEditUserId(null);
    setEditedUser({});
    showSnackbar('Edit cancelled', 'info');
  };

  const saveUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        username: editedUser.username,
        email: editedUser.email,
        role: editedUser.role,
        bio: editedUser.bio // optional, if present
      };
      await axios.put(`http://localhost:3000/api/users/${editUserId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchUsers();
      cancelEditing();
      showSnackbar('User updated successfully', 'success');
    } catch (error) {
      console.error('Error saving user:', error.response?.data || error.message);
      const msg = error.response?.data?.message || 'Failed to update user';
      showSnackbar(msg, 'error');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
        showSnackbar('User deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting user:', error.response?.data || error.message);
        const msg = error.response?.data?.message || 'Failed to delete user';
        showSnackbar(msg, 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
            Manage Users
          </Typography>

          {/* Search Bar */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <SearchIcon />
            <TextField
              variant="outlined"
              placeholder="Search users by username or email"
              onChange={handleSearchChange}
              fullWidth
            />
          </Box>

          {/* Users Table */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User List
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No users found with role 'user'.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow
                        key={user.user_id}
                        sx={editUserId === user.user_id ? { backgroundColor: 'rgba(107,78,255,0.08)' } : {}}
                      >
                        <TableCell>
                          {editUserId === user.user_id ? (
                            <TextField
                              value={editedUser.username || ''}
                              onChange={(e) =>
                                setEditedUser({ ...editedUser, username: e.target.value })
                              }
                              size="small"
                            />
                          ) : (
                            user.username
                          )}
                        </TableCell>
                        <TableCell>
                          {editUserId === user.user_id ? (
                            <TextField
                              value={editedUser.email || ''}
                              onChange={(e) =>
                                setEditedUser({ ...editedUser, email: e.target.value })
                              }
                              size="small"
                            />
                          ) : (
                            user.email
                          )}
                        </TableCell>
                        <TableCell>
                          {editUserId === user.user_id ? (
                            <Select
                              value={editedUser.role || 'user'}
                              onChange={(e) =>
                                setEditedUser({ ...editedUser, role: e.target.value })
                              }
                              size="small"
                            >
                              <MenuItem value="user">User</MenuItem>
                              <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                          ) : (
                            user.role
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          {editUserId === user.user_id ? (
                            <>
                              <Tooltip title="Save">
                                <IconButton onClick={saveUser} color="primary">
                                  <SaveIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel">
                                <IconButton onClick={cancelEditing} color="inherit">
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="Edit">
                                <IconButton onClick={() => startEditing(user)} color="primary">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton onClick={() => deleteUser(user.user_id)} color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>

        {/* Snackbar for feedback (top-center) */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ManageUsers;
