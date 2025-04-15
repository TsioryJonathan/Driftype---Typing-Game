import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getStatistics } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/', authMiddleware, getStatistics);

export default router;
