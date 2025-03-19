import express from 'express';
import authenticate from '../middleware.js';
import { getSupervisorById } from '../controllers/supervisorController.js';

const router = express.Router();



router.get('/:id', authenticate, getSupervisorById);

export default router;