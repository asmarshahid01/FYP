import express from 'express';
import authenticate from '../middleware.js';
import { getNotification } from '../controllers/notificationController.js';


const router = express.Router();

router.get("/",authenticate,getNotification);

export default router;