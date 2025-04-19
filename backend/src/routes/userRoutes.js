import express from "express";
import {
  getUserBio,
  getUserDetail,
  updateUserBio,
  updateUserDetails,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", authMiddleware, getUserDetail);
router.put("/:userId", authMiddleware, updateUserDetails);
router.post("/bio/:userId", authMiddleware, updateUserBio);
router.get("/bio/:userId", authMiddleware, getUserBio);

export default router;
