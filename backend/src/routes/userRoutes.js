import express from 'express';
import { getUserDetail } from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', getUserDetail);

export default router;
