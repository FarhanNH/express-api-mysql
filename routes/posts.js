const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/database');

router.get('/create-table-posts', (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Table created successfully',
    });
  });
});

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM posts ORDER BY id DESC';
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'List Data Posts',
      data: result,
    });
  });
});

router.post('/store', [body('title').notEmpty(), body('content').notEmpty()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  const formData = {
    title: req.body.title,
    content: req.body.content,
  };
  const sql = 'INSERT INTO posts SET ?';
  connection.query(sql, formData, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    }
    return res.status(201).json({
      status: true,
      message: 'Data created successfully',
      data: result[0],
    });
  });
});

router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM posts WHERE id = ?';
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    }
    if (result.length <= 0) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Detail Data Post',
      data: result[0],
    });
  });
});

router.patch('/update/:id', [body('title').notEmpty(), body('content').notEmpty()], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  const formData = {
    title: req.body.title,
    content: req.body.content,
  };
  const sql = 'UPDATE posts SET ? WHERE id = ?';
  connection.query(sql, [formData, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    }
    if (result.affectedRows <= 0) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Data updated successfully',
      data: result[0],
    });
  });
});

router.delete('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM posts WHERE id = ?';
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error',
      });
    }
    if (result.affectedRows <= 0) {
      return res.status(404).json({
        status: false,
        message: 'Post not found',
      });
    }
    return res.status(200).json({
      status: true,
      message: 'Data deleted successfully',
    });
  });
});

module.exports = router;
