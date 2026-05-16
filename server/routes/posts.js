import express from 'express';
import { getFeedPosts, getUserPosts, likePost, addComment, deletePost } from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Read
router.get('/', verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);

// Update
router.patch('/:id/like', verifyToken, likePost);
router.post('/:id/comment', verifyToken, addComment);

// Delete
router.delete('/:id', verifyToken, deletePost);

export default router;