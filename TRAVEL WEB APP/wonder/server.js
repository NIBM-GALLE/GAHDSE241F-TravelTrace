const express = require('express');
const cors = require('cors');
const path = require('path');
const trailsRouter = require('./src/api/trails.js');
const mysql = require('mysql2');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'dist')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rash226@',
  database: 'wonder_map',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = file.fieldname === 'video' ? 'uploads/videos' : 'uploads/images';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// JWT middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, 'your_jwt_secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Error registering user' });
        }
        res.json({ message: 'User registered successfully' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (results.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.user_id, role: user.role }, 'your_jwt_secret');
    res.json({ token, user: { id: user.user_id, username: user.username, email: user.email, role: user.role } });
  });
});

// Trail routes
app.post('/api/trails', verifyToken, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  const { name, category, short_description, start_lat, start_lng, end_lat, end_lng, trail_date, trail_time } = req.body;
  const photo_url = req.files?.photo ? `/uploads/images/${req.files.photo[0].filename}` : null;
  const video_url = req.files?.video ? `/uploads/videos/${req.files.video[0].filename}` : null;

  db.query(
    'INSERT INTO trails (user_id, name, category, short_description, start_lat, start_lng, end_lat, end_lng, photo_url, video_url, trail_date, trail_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, name, category, short_description, start_lat, start_lng, end_lat, end_lng, photo_url, video_url, trail_date, trail_time],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error creating trail' });
      res.json({ message: 'Trail created successfully', trailId: result.insertId });
    }
  );
});

app.get('/api/trails', (req, res) => {
  db.query('SELECT * FROM trails ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching trails' });
    res.json(results);
  });
});

app.get('/api/trails/:id', (req, res) => {
  db.query('SELECT * FROM trails WHERE trail_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching trail' });
    if (results.length === 0) return res.status(404).json({ error: 'Trail not found' });
    res.json(results[0]);
  });
});

app.get('/api/users/:id/trails', (req, res) => {
  db.query('SELECT * FROM trails WHERE user_id = ? ORDER BY created_at DESC', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching user trails' });
    res.json(results);
  });
});

// Get all users (or filter by role)
app.get('/api/users', verifyToken, (req, res) => {
  const { role } = req.query;
  let query = 'SELECT user_id, username, email, role, created_at, profile_image_url, bio FROM users';
  const params = [];

  if (role) {
    query += ' WHERE role = ?';
    params.push(role);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.json(results);
  });
});

// Update user profile (including role, username, email, bio, and profile image)
app.put('/api/users/:id', verifyToken, upload.single('profile_image'), (req, res) => {
  const { username, email, bio, role } = req.body;
  const profile_image_url = req.file ? `/uploads/images/${req.file.filename}` : null;

  let query = 'UPDATE users SET';
  const params = [];
  const updates = [];

  if (username) { updates.push('username = ?'); params.push(username); }
  if (email) { updates.push('email = ?'); params.push(email); }
  if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); } // Allow setting bio to null/empty
  if (role) { updates.push('role = ?'); params.push(role); }
  if (profile_image_url) { updates.push('profile_image_url = ?'); params.push(profile_image_url); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  query += ' ' + updates.join(', ') + ' WHERE user_id = ?';
  params.push(req.params.id);

  db.query(query, params, (err) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Error updating profile' });
    }
    res.json({ message: 'Profile updated successfully' });
  });
});

// Delete user
app.delete('/api/users/:id', verifyToken, (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE user_id = ?', [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Error deleting user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Feedback route (new)
app.post('/api/feedback', (req, res) => {
  const { emoji, text, timestamp } = req.body;

  if (!emoji && !text) {
    return res.status(400).json({ error: 'Feedback cannot be empty' });
  }

  db.query(
    'INSERT INTO feedbacks (emoji, text, timestamp) VALUES (?, ?, ?)',
    [emoji || null, text || null, timestamp || new Date()],
    (err, result) => {
      if (err) {
        console.error('Error saving feedback:', err);
        return res.status(500).json({ error: 'Failed to save feedback' });
      }
      res.status(201).json({ message: 'Feedback received', feedbackId: result.insertId });
    }
  );
});

// API routes
app.use('/api/trails', trailsRouter);

// Update trail
app.put('/api/trails/:id', verifyToken, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  const { name, category, short_description, start_lat, start_lng, end_lat, end_lng, trail_date, trail_time } = req.body;
  const photo_url = req.files?.photo ? `/uploads/images/${req.files.photo[0].filename}` : null;
  const video_url = req.files?.video ? `/uploads/videos/${req.files.video[0].filename}` : null;

  let query = 'UPDATE trails SET';
  const params = [];
  const updates = [];

  if (name) { updates.push('name = ?'); params.push(name); }
  if (category) { updates.push('category = ?'); params.push(category); }
  if (short_description) { updates.push('short_description = ?'); params.push(short_description); }
  if (start_lat) { updates.push('start_lat = ?'); params.push(start_lat); }
  if (start_lng) { updates.push('start_lng = ?'); params.push(start_lng); }
  if (end_lat) { updates.push('end_lat = ?'); params.push(end_lat); }
  if (end_lng) { updates.push('end_lng = ?'); params.push(end_lng); }
  if (trail_date) { updates.push('trail_date = ?'); params.push(trail_date); }
  if (trail_time) { updates.push('trail_time = ?'); params.push(trail_time); }
  if (photo_url) { updates.push('photo_url = ?'); params.push(photo_url); }
  if (video_url) { updates.push('video_url = ?'); params.push(video_url); }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  query += ' ' + updates.join(', ') + ' WHERE trail_id = ?';
  params.push(req.params.id);

  db.query(query, params, (err) => {
    if (err) {
      console.error('Error updating trail:', err);
      return res.status(500).json({ error: 'Error updating trail' });
    }
    res.json({ message: 'Trail updated successfully' });
  });
});

// Delete trail
app.delete('/api/trails/:id', verifyToken, (req, res) => {
  const trailId = req.params.id;
  db.query('DELETE FROM trails WHERE trail_id = ?', [trailId], (err, result) => {
    if (err) {
      console.error('Error deleting trail:', err);
      return res.status(500).json({ error: 'Error deleting trail' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Trail not found' });
    }
    res.json({ message: 'Trail deleted successfully' });
  });
});

// Dashboard Summary API
app.get('/api/dashboard/summary', verifyToken, (req, res) => {
  const summary = {};

  // Get total users
  db.query('SELECT COUNT(*) AS total_users FROM users', (err, userResults) => {
    if (err) {
      console.error('Error fetching total users:', err);
      return res.status(500).json({ error: 'Error fetching dashboard summary' });
    }
    summary.total_users = userResults[0].total_users;

    // Get total trails
    db.query('SELECT COUNT(*) AS total_trails FROM trails', (err, trailResults) => {
      if (err) {
        console.error('Error fetching total trails:', err);
        return res.status(500).json({ error: 'Error fetching dashboard summary' });
      }
      summary.total_trails = trailResults[0].total_trails;

      res.json(summary);
    });
  });
});

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Create upload directories if they don't exist
const dirs = ['public/images', 'public/videos'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


//Query to create feedbacks table
/*CREATE TABLE feedbacks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/

