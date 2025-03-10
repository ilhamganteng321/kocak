import express from 'express';
import { protecRoute } from '../middleware/auth.middleware.js';
import { getMessage, getUsersForSideBar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", protecRoute, getUsersForSideBar)
router.get("/:id", protecRoute,getMessage)

router.post("/send/:id", protecRoute, sendMessage)

export default router;