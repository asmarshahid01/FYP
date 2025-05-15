import express from 'express';
import { getMessages,sendMessage } from '../controllers/chatController.js';
import authenticate from '../middleware.js';


const router=express.Router();



router.get("/:id",authenticate,getMessages);
router.post("/send/:id",authenticate,sendMessage);

export default router;