const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wonder_map'
});

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only (jpeg, jpg, png)!');
    }
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Username or email already exists' });
        }
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in' });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        'your_jwt_secret',
        { expiresIn: '24h' }
      );
      
      res.json({
        token,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT user_id, username, email, profile_image_url, bio FROM users WHERE user_id = ?';
    db.query(query, [req.user.id], (err, results) => {
      if (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ message: 'Error fetching profile' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get user's trails
      const trailsQuery = 'SELECT * FROM trails WHERE user_id = ?';
      db.query(trailsQuery, [req.user.id], (err, trails) => {
        if (err) {
          console.error('Error fetching trails:', err);
          return res.status(500).json({ message: 'Error fetching trails' });
        }

        const userProfile = results[0];
        userProfile.trails = trails;

        res.json({
          success: true,
          data: userProfile
        });
      });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', verifyToken, upload.single('profile_image'), async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updateFields = [];
    const values = [];

    if (name) {
      updateFields.push('username = ?');
      values.push(name);
    }

    if (bio) {
      updateFields.push('bio = ?');
      values.push(bio);
    }

    if (req.file) {
      updateFields.push('profile_image_url = ?');
      values.push(`/uploads/profiles/${req.file.filename}`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(req.user.id);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
    
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: 'Error updating profile' });
      }

      // Fetch updated profile
      db.query('SELECT user_id, username, email, profile_image_url, bio FROM users WHERE user_id = ?',
        [req.user.id],
        (err, results) => {
          if (err) {
            console.error('Error fetching updated profile:', err);
            return res.status(500).json({ message: 'Error fetching updated profile' });
          }

          res.json({
            success: true,
            data: results[0]
          });
        }
      );
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile image
router.post('/profile/image', verifyToken, upload.single('profile_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    const query = 'UPDATE users SET profile_image_url = ? WHERE user_id = ?';
    
    db.query(query, [imageUrl, req.user.id], (err, result) => {
      if (err) {
        console.error('Error updating profile image:', err);
        return res.status(500).json({ message: 'Error updating profile image' });
      }

      res.json({
        success: true,
        data: {
          profile_image_url: imageUrl
        }
      });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 