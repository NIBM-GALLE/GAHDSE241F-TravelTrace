import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import FeedbackIcon from '@mui/icons-material/Feedback';

const API_BASE = 'http://localhost:8080/api/feedbacks';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchFeedbacks();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(`${API_BASE}/feedbacks`);
      const data = await res.json();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery)
  );

  const startEditing = (user) => {
    setEditUserId(user.id);
    setEditedUser(user);
  };

  const saveUser = async () => {
    try {
      await fetch(`${API_BASE}/users/${editUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });
      fetchUsers(); // Refresh list after update
      setEditUserId(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Manage Users
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SearchIcon />
        <TextField
          variant="outlined"
          placeholder="Search users by name or email"
          onChange={handleSearchChange}
          fullWidth
        />
      </Box>

      {/* Users Table */}
      <Paper elevation={3} sx={{ p: 2, mb: 5 }}>
        <Typography variant="h6" gutterBottom>User List</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editUserId === user.id ? (
                    <TextField
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell>
                  {editUserId === user.id ? (
                    <TextField
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editUserId === user.id ? (
                    <TextField
                      value={editedUser.role}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, role: e.target.value })
                      }
                    />
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell align="right">
                  {editUserId === user.id ? (
                    <IconButton onClick={saveUser} color="primary">
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => startEditing(user)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Feedback Section */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          <FeedbackIcon sx={{ mr: 1 }} />
          User Feedback
        </Typography>
        {feedbacks.length === 0 ? (
          <Typography>No feedback submitted yet.</Typography>
        ) : (
          feedbacks.map((fb) => (
            <Box
              key={fb.id}
              sx={{
                borderBottom: '1px solid #ddd',
                pb: 2,
                mb: 2,
              }}
            >
              <Typography fontWeight="bold">{fb.user_name}</Typography>
              <Typography>Rating: {fb.rating}</Typography>
              <Typography color="text.secondary">{fb.message}</Typography>
              <Typography variant="caption" color="text.disabled">
                Submitted: {new Date(fb.created_at).toLocaleString()}
              </Typography>
            </Box>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default ManageUsers;
