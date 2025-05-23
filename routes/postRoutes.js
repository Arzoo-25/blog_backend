// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts
} = require('../controllers/postController');

router.post('/', verifyToken, createPost);
router.get('/', getAllPosts);
router.get('/my-posts', verifyToken, getUserPosts);
router.get('/:id', getPostById);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
