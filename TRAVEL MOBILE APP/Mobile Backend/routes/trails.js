const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wonder_map'
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, '..', 'uploads', 'trails');
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

// Get all trails
router.get('/', async (req, res) => {
  const query = `
    SELECT t.*, u.username as creator_name 
    FROM trails t 
    JOIN users u ON t.user_id = u.user_id 
    ORDER BY t.created_at DESC
  `;

  req.db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching trails:', err);
      return res.status(500).json({ message: 'Failed to fetch trails' });
    }
    res.json(results);
  });
});

// Get single trail
router.get('/:id', (req, res) => {
  const trailId = req.params.id;
  const query = 'SELECT * FROM trails WHERE trail_id = ?';
  
  db.query(query, [trailId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching trail' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Trail not found' });
    }
    res.json(results[0]);
  });
});

// Create new trail
router.post('/', verifyToken, upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      start_lat,
      start_lng,
      end_lat,
      end_lng,
      trail_date,
      trail_time,
      special_points
    } = req.body;

    // Get file paths if files were uploaded
    const photoUrl = req.files['photo'] ? 
      `/uploads/trails/photos/${req.files['photo'][0].filename}` : null;
    const videoUrl = req.files['video'] ? 
      `/uploads/trails/videos/${req.files['video'][0].filename}` : null;

    // Insert trail into database
    const query = `
      INSERT INTO trails (
        user_id, name, category, short_description, 
        start_lat, start_lng, end_lat, end_lng,
        video_url, photo_url, trail_date, trail_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.user.id,
      name,
      category,
      description,
      start_lat,
      start_lng,
      end_lat,
      end_lng,
      videoUrl,
      photoUrl,
      trail_date,
      trail_time
    ];

    req.db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error creating trail:', err);
        return res.status(500).json({ message: 'Failed to create trail' });
      }

      const trailId = result.insertId;

      // If there are special points, insert them
      if (special_points) {
        const points = JSON.parse(special_points);
        const pointsQuery = `
          INSERT INTO special_points (trail_id, name, lat, lng)
          VALUES ?
        `;

        const pointValues = points.map(point => [
          trailId,
          point.name,
          point.lat,
          point.lng
        ]);

        req.db.query(pointsQuery, [pointValues], (err) => {
          if (err) {
            console.error('Error inserting special points:', err);
            // Continue anyway since the trail was created
          }
        });
      }

      res.status(201).json({
        success: true,
        data: {
          id: trailId,
          name,
          category,
          description,
          start_lat,
          start_lng,
          end_lat,
          end_lng,
          video_url: videoUrl,
          photo_url: photoUrl,
          trail_date,
          trail_time,
          special_points: special_points ? JSON.parse(special_points) : []
        }
      });
    });
  } catch (error) {
    console.error('Error in trail creation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update trail
router.put('/:id', (req, res) => {
  const trailId = req.params.id;
  const {
    name,
    category,
    short_description,
    start_lat,
    start_lng,
    end_lat,
    end_lng,
    video_url,
    photo_url,
    trail_date,
    trail_time
  } = req.body;

  const query = `
    UPDATE trails 
    SET name = ?, category = ?, short_description = ?, 
    start_lat = ?, start_lng = ?, end_lat = ?, end_lng = ?,
    video_url = ?, photo_url = ?, trail_date = ?, trail_time = ?
    WHERE trail_id = ?
  `;

  db.query(
    query,
    [name, category, short_description, start_lat, start_lng,
    end_lat, end_lng, video_url, photo_url, trail_date, trail_time, trailId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating trail' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Trail not found' });
      }
      res.json({ message: 'Trail updated successfully' });
    }
  );
});

// Delete trail
router.delete('/:id', (req, res) => {
  const trailId = req.params.id;
  const query = 'DELETE FROM trails WHERE trail_id = ?';

  db.query(query, [trailId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting trail' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Trail not found' });
    }
    res.json({ message: 'Trail deleted successfully' });
  });
});

// Get user's trails
router.get('/user', verifyToken, async (req, res) => {
  const query = `
    SELECT * FROM trails 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;

  req.db.query(query, [req.user.id], (err, results) => {
    if (err) {
      console.error('Error fetching user trails:', err);
      return res.status(500).json({ message: 'Failed to fetch trails' });
    }
    res.json(results);
  });
});

module.exports = router; 