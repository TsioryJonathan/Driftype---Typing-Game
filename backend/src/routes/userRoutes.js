import express from 'express';
import {
  getUserDetail,
  updateUserDetails,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', getUserDetail);
router.put('/:userId', updateUserDetails);

export default router;
