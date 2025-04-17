import express from 'express';
import {
  getSpecificStat,
  getRecentUserStat,
  postUserStat,
  getOverallStat,
} from '../controllers/statController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/recent/:userId', getRecentUserStat);
router.get('/global/:userId', getOverallStat);
router.post('/:userId', postUserStat);
router.get('/:userId/filters', getSpecificStat);

export default router;
