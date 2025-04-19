import express from "express";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.googleSignIn);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);


router.get("/dashboard", authMiddleware, authController.getProfile);

export default router;
