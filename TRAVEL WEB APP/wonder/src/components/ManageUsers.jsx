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
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Search as SearchIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';

const drawerWidth = 240;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/users?role=user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.username?.toLowerCase().includes(searchQuery) ||
      user.email?.toLowerCase().includes(searchQuery))
  );

  const startEditing = (user) => {
    setEditUserId(user.user_id);
    setEditedUser(user);
  };

  const saveUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/users/${editUserId}`, editedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      fetchUsers();
      setEditUserId(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers(); // Refresh list after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
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
          <Paper elevation={3} sx={{ p: 2, mb: 5 }}>
            <Typography variant="h6" gutterBottom>User List</Typography>
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
                      <TableCell colSpan={5} align="center">No users found with role 'user'.</TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.user_id}>
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
                              fullWidth
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
                            <Tooltip title="Save">
                              <IconButton onClick={saveUser} color="primary">
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() => startEditing(user)}
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton onClick={() => deleteUser(user.user_id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
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

export default ManageUsers;
