import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import CreateTrail from './components/CreateTrail';
import Profile from './components/Profile';
import Search from './components/Search';
import About from './components/About';
import Support from './components/Support'; // adjust the path if needed
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ManageTrails from './components/ManageTrails';
import AdminFeedback from './components/AdminFeedback';



const theme = createTheme({
  palette: {
    primary: {
      main: '#6B4EFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }
  return children;
};

const InitialAuthCheck = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user && user.role) {
      if (user.role === 'admin') {
        navigate('/admindashboard', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);
  return null;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<InitialAuthCheck />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-trail"
            element={
              <ProtectedRoute>
                <CreateTrail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />

          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admindashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <ManageUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/trails"
            element={
              <AdminProtectedRoute>
                <ManageTrails />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <AdminProtectedRoute>
                <AdminFeedback />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
