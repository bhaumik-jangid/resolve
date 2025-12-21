import express from "express";
import { signup, signin, googleAuth, getMe } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.get("/me", authMiddleware, getMe);

export default router;
