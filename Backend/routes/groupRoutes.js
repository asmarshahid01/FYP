import {
	findGroupByStudentId,
	updateGroupById,
	leaveGroup,
} from '../controllers/groupController.js';
import express from 'express';
import authenticate from '../middleware.js';

const router = express.Router();

router.get('/', authenticate, findGroupByStudentId);
router.put('/:id', authenticate, updateGroupById);
router.post('/leave', authenticate, leaveGroup);

export default router;
