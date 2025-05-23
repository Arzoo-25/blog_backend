// controllers/postController.js
const db = require('../models/db');

// Create Post
const createPost = (req, res) => {
  const { title, summary, content } = req.body;
  const userId = req.user.id;

  const sql = 'INSERT INTO posts (title, summary, content, user_id) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, summary, content, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Post created successfully' });
  });
};

// Get All Posts (Public)
const getAllPosts = (req, res) => {
  const sql = `
    SELECT posts.id, title, summary, posts.created_at, users.username AS author
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get Single Post
const getPostById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT posts.id, title, summary, content, posts.created_at, users.username AS author
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'Post not found' });
    res.json(results[0]);
  });
};

// Get Authenticated User's Posts
const getUserPosts = (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Update Post
const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, summary, content } = req.body;
  const userId = req.user.id;

  const sql = 'UPDATE posts SET title = ?, summary = ?, content = ? WHERE id = ? AND user_id = ?';
  db.query(sql, [title, summary, content, id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(403).json({ message: 'Unauthorized or post not found' });
    res.json({ message: 'Post updated successfully' });
  });
};

// Delete Post
const deletePost = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = 'DELETE FROM posts WHERE id = ? AND user_id = ?';
  db.query(sql, [id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(403).json({ message: 'Unauthorized or post not found' });
    res.json({ message: 'Post deleted successfully' });
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts
};
