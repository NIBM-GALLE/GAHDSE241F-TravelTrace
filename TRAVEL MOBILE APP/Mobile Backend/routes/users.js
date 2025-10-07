// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

// IMPORTANT: ensure this path matches where your auth middleware lives
// must export: { verifyToken, JWT_SECRET }
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rash226@',
  database: 'wonder_map'
});

// Multer for profile uploads
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
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb('Error: Images only (jpeg, jpg, png)!');
  }
});

// -------------------- AUTH / USER ROUTES -------------------- //

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    db.query('SELECT user_id FROM users WHERE email = ? OR username = ? LIMIT 1', [email, username], async (dupErr, dupResults) => {
      if (dupErr) {
        console.error('Error checking duplicates:', dupErr);
        return res.status(500).json({ message: 'Server error' });
      }
      if (dupResults && dupResults.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);
          if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username or email already exists' });
          return res.status(500).json({ message: 'Error registering user' });
        }
        return res.status(201).json({ message: 'User registered successfully', userId: results.insertId });
      });
    });
  } catch (error) {
    console.error('Unexpected error in /register:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Error fetching user during login:', err);
        return res.status(500).json({ message: 'Error logging in' });
      }
      if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

      // Sign token with normalized payload { id, role }
      const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

      return res.json({
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
    console.error('Unexpected error in /login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get authenticated user's profile
router.get('/profile', verifyToken, (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });

    const query = 'SELECT user_id, username, email, profile_image_url, bio FROM users WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ message: 'Error fetching profile' });
      }
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });

      const trailsQuery = 'SELECT * FROM trails WHERE user_id = ?';
      db.query(trailsQuery, [userId], (err2, trails) => {
        if (err2) {
          console.error('Error fetching trails:', err2);
          return res.status(500).json({ message: 'Error fetching trails' });
        }
        const userProfile = results[0];
        userProfile.trails = trails;
        return res.json({ success: true, data: userProfile });
      });
    });
  } catch (err) {
    console.error('Error in GET /profile:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update authenticated user's profile (username/bio/profile image)
router.put('/profile', verifyToken, upload.single('profile_image'), (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });

    const { name, bio } = req.body;
    const updates = [];
    const params = [];

    if (name) { updates.push('username = ?'); params.push(name); }
    if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
    if (req.file) { updates.push('profile_image_url = ?'); params.push(`/uploads/profiles/${req.file.filename}`); }

    if (updates.length === 0) return res.status(400).json({ message: 'No fields to update' });

    params.push(userId);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: 'Error updating profile' });
      }
      db.query('SELECT user_id, username, email, profile_image_url, bio FROM users WHERE user_id = ?', [userId], (err2, results) => {
        if (err2) {
          console.error('Error fetching updated profile:', err2);
          return res.status(500).json({ message: 'Error fetching updated profile' });
        }
        return res.json({ success: true, data: results[0] });
      });
    });
  } catch (err) {
    console.error('Error in PUT /profile:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update profile image (single endpoint)
router.post('/profile/image', verifyToken, upload.single('profile_image'), (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Invalid token payload' });
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    db.query('UPDATE users SET profile_image_url = ? WHERE user_id = ?', [imageUrl, userId], (err) => {
      if (err) {
        console.error('Error updating profile image:', err);
        return res.status(500).json({ message: 'Error updating profile image' });
      }
      return res.json({ success: true, data: { profile_image_url: imageUrl } });
    });
  } catch (err) {
    console.error('Error in POST /profile/image:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// -------------------- ADMIN / MANAGEMENT ROUTES -------------------- //

// List users (admin only). optional: ?role=user
router.get('/', verifyToken, (req, res) => {
  try {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

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
        return res.status(500).json({ message: 'Error fetching users' });
      }
      return res.json(results);
    });
  } catch (err) {
    console.error('Error in GET / (list users):', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get a user's trails (public)
router.get('/:id/trails', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM trails WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user trails:', err);
      return res.status(500).json({ message: 'Error fetching user trails' });
    }
    return res.json(results);
  });
});

// Update any user (admin) or the user themself
router.put('/:id', verifyToken, (req, res) => {
  try {
    const targetId = req.params.id;
    const callerId = req.user?.id;
    const callerRole = req.user?.role;

    if (callerRole !== 'admin' && String(callerId) !== String(targetId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { username, email, bio, role } = req.body;
    const updates = [];
    const params = [];

    if (username) { updates.push('username = ?'); params.push(username); }
    if (email) { updates.push('email = ?'); params.push(email); }
    if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
    if (role && callerRole === 'admin') { updates.push('role = ?'); params.push(role); }

    if (updates.length === 0) return res.status(400).json({ message: 'No fields to update' });

    params.push(targetId);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username or email already exists' });
        return res.status(500).json({ message: 'Error updating user' });
      }
      return res.json({ message: 'User updated successfully' });
    });
  } catch (err) {
    console.error('Error in PUT /:id:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user (admin only)
router.delete('/:id', verifyToken, (req, res) => {
  try {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const targetId = req.params.id;
    db.query('DELETE FROM users WHERE user_id = ?', [targetId], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: 'Error deleting user' });
      }
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      return res.json({ message: 'User deleted successfully' });
    });
  } catch (err) {
    console.error('Error in DELETE /:id:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
