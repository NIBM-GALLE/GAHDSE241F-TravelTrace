const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/db.js');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = file.fieldname === 'video' ? 'public/videos' : 'public/images';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "video") {
      if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
        return cb(new Error('Only video files are allowed!'));
      }
    } else if (file.fieldname === "photo") {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'));
      }
    }
    cb(null, true);
  }
});

// Get all trails
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM trails ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new trail with file uploads
router.post('/', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      user_id,
      name,
      category,
      short_description,
      start_lat,
      start_lng,
      end_lat,
      end_lng,
      trail_date,
      trail_time
    } = req.body;

    const photo_url = req.files['photo'] ? `/images/${req.files['photo'][0].filename}` : null;
    const video_url = req.files['video'] ? `/videos/${req.files['video'][0].filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO trails (
        user_id, name, category, short_description,
        start_lat, start_lng, end_lat, end_lng,
        video_url, photo_url, trail_date, trail_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, category, short_description,
       start_lat, start_lng, end_lat, end_lng,
       video_url, photo_url, trail_date, trail_time]
    );

    res.status(201).json({
      message: 'Trail created successfully',
      trail_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trail by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM trails WHERE trail_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Trail not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;