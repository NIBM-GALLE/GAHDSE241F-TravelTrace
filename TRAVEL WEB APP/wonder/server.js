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
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));
app.use(express.static(path.join(__dirname, 'dist')));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
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

// Authentication middleware
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

    const token = jwt.sign({ id: user.user_id }, 'your_jwt_secret');
    res.json({ token, user: { id: user.user_id, username: user.username, email: user.email } });
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

// User profile routes
app.put('/api/users/:id', verifyToken, upload.single('profile_image'), (req, res) => {
  const { bio } = req.body;
  const profile_image_url = req.file ? `/uploads/images/${req.file.filename}` : null;

  const updateData = profile_image_url 
    ? { bio, profile_image_url }
    : { bio };

  db.query(
    'UPDATE users SET ? WHERE user_id = ?',
    [updateData, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error updating profile' });
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// API routes
app.use('/api/trails', trailsRouter);

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