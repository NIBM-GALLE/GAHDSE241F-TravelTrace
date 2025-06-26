import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CssBaseline,
} from '@mui/material';
import { SentimentVeryDissatisfied, SentimentDissatisfied, SentimentNeutral, SentimentSatisfied, SentimentVerySatisfied } from '@mui/icons-material';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';

const drawerWidth = 240;

const emojiMap = {
  'Very Bad': <SentimentVeryDissatisfied color="error" />,
  'Bad': <SentimentDissatisfied color="error" />,
  'Neutral': <SentimentNeutral color="warning" />,
  'Good': <SentimentSatisfied color="success" />,
  'Excellent': <SentimentVerySatisfied color="primary" />,
};

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/feedback');
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };
    fetchFeedbacks();
  }, []);

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
        <Box sx={{ height: '64px' }} /> {/* Spacer for the toolbar height */}
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
            User Feedback
          </Typography>
          <Paper elevation={3} sx={{ p: 3 }}>
            {feedbacks.length === 0 ? (
              <Typography>No feedback submitted yet.</Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rating</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feedbacks.map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell>{emojiMap[feedback.emoji] || 'N/A'}</TableCell>
                        <TableCell>{feedback.text || 'No message'}</TableCell>
                        <TableCell>{new Date(feedback.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminFeedback; 