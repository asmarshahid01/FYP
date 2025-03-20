import express from 'express';
import {
	createRequest,
	getRequests,
	deleteRequest,
	acceptRequest,
	getPendingRequests,
} from '../controllers/requestController.js';
import authenticate from '../middleware.js'; // Using your authentication middleware

const router = express.Router();
router.post('/', authenticate, createRequest);
router.get('/', authenticate, getRequests);
router.delete('/:id', authenticate, deleteRequest);
router.post('/:id/accept', authenticate, acceptRequest);
router.get('/pending', authenticate, getPendingRequests);

export default router;
