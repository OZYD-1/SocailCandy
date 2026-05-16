import express from 'express';
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  searchUsers,
  updateProfile,
  sendFriendRequest,
  getNotifications,
  markNotificationsSeen,
  acceptFriendRequest,
  declineFriendRequest,
} from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Read
router.get('/search/user', verifyToken, searchUsers);
router.get('/:id/notifications', verifyToken, getNotifications);
router.get('/:id/friends', verifyToken, getUserFriends);
router.get('/:id', verifyToken, getUser);

// Friend Requests
router.post('/:id/request/:targetId', verifyToken, sendFriendRequest);
router.post('/:id/accept/:fromId', verifyToken, acceptFriendRequest);
router.delete('/:id/decline/:fromId', verifyToken, declineFriendRequest);

// Update
router.patch('/:id/profile', verifyToken, updateProfile);
router.patch('/:id/notifications/seen', verifyToken, markNotificationsSeen);
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

export default router;