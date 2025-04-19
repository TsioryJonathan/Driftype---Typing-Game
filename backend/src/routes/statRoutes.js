import express from "express";
import {
  getSpecificStat,
  getRecentUserStat,
  postUserStat,
  getOverallStat,
} from "../controllers/statController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/recent/:userId", authMiddleware, getRecentUserStat);
router.get("/global/:userId", authMiddleware, getOverallStat);
router.post("/:userId", authMiddleware, postUserStat);
router.get("/:userId/filters", authMiddleware, getSpecificStat);

export default router;
