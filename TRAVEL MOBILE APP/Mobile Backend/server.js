require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, 'uploads/trails');
    if (file.fieldname === 'photo') {
      uploadPath = path.join(uploadPath, 'photos');
    } else if (file.fieldname === 'video') {
      uploadPath = path.join(uploadPath, 'videos');
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image file'), false);
    }
  } else if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Not a video file'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Create upload directories if they don't exist
const uploadDirs = [
  'uploads',
  'uploads/profiles',
  'uploads/trails',
  'uploads/trails/photos',
  'uploads/trails/videos'
];

uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rash226@',
  database: 'wonder_map'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to database successfully');
});

// Make db available in routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
const userRoutes = require('./routes/users');
const trailRoutes = require('./routes/trails');
const specialPointRoutes = require('./routes/specialPoints');

app.use('/api/users', userRoutes);
app.use('/api/trails', trailRoutes);
app.use('/api/special-points', specialPointRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Travel Trace API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: err.message || 'Something went wrong!' 
  });
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log('Available routes:');
  console.log('- POST /api/users/register');
  console.log('- POST /api/users/login');
  console.log('- GET /api/users/profile');
  console.log('- PUT /api/users/profile');
  console.log('- POST /api/trails');
  console.log('- GET /api/trails');
  console.log('- GET /api/trails/user');
});