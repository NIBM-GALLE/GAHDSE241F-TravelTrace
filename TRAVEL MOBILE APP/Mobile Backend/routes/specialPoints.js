const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wonder_map'
});

// Get all special points
router.get('/', (req, res) => {
  const query = 'SELECT * FROM special_points';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching special points' });
    }
    res.json(results);
  });
});

// Get special points by trail
router.get('/trail/:trailId', (req, res) => {
  const trailId = req.params.trailId;
  const query = 'SELECT * FROM special_points WHERE trail_id = ?';
  
  db.query(query, [trailId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching special points' });
    }
    res.json(results);
  });
});

// Get single special point
router.get('/:id', (req, res) => {
  const pointId = req.params.id;
  const query = 'SELECT * FROM special_points WHERE point_id = ?';
  
  db.query(query, [pointId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching special point' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Special point not found' });
    }
    res.json(results[0]);
  });
});

// Create new special point
router.post('/', (req, res) => {
  const { trail_id, name, lat, lng } = req.body;

  const query = 'INSERT INTO special_points (trail_id, name, lat, lng) VALUES (?, ?, ?, ?)';
  db.query(query, [trail_id, name, lat, lng], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating special point' });
    }
    res.status(201).json({
      message: 'Special point created successfully',
      pointId: results.insertId
    });
  });
});

// Update special point
router.put('/:id', (req, res) => {
  const pointId = req.params.id;
  const { name, lat, lng } = req.body;

  const query = 'UPDATE special_points SET name = ?, lat = ?, lng = ? WHERE point_id = ?';
  db.query(query, [name, lat, lng, pointId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating special point' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Special point not found' });
    }
    res.json({ message: 'Special point updated successfully' });
  });
});

// Delete special point
router.delete('/:id', (req, res) => {
  const pointId = req.params.id;
  const query = 'DELETE FROM special_points WHERE point_id = ?';

  db.query(query, [pointId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting special point' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Special point not found' });
    }
    res.json({ message: 'Special point deleted successfully' });
  });
});

module.exports = router; 