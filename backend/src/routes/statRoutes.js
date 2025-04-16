import express from 'express';
import { getUserStat, postUserStat } from '../controllers/statController.js';

const router = express.Router();

router.get('/:userId', getUserStat);
router.post('/:userId', postUserStat);

export default router;
