import express from 'express';
import { getUserStat, postUserStat } from '../controllers/statController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', authMiddleware, getUserStat);
router.post('/:userId', postUserStat);

export default router;
