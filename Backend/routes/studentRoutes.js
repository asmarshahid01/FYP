import express from 'express';
import { login } from '../controllers/studentController.js';

const router = express.Router();

router.post('/login', login);

export default router;
