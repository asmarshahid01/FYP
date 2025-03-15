import express from 'express';
import { getInfo, login } from '../controllers/studentController.js';
import authenticate from '../middleware.js';

const router = express.Router();

router.post('/login', login);
router.get("/info",authenticate,getInfo);

export default router;
