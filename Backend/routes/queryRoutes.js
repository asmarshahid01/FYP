import express from 'express';
import {
	createQuery,
	getUserQueries,
	getAllQueries,
	replyToQuery,
} from '../controllers/queryController.js';
import authenticate from '../middleware.js';

const router = express.Router();

// Create a new query
router.post('/', authenticate, createQuery);
// Get all queries by the current user
router.get('/my', authenticate, getUserQueries);
// Get all queries (admin/coordinator)
router.get('/all', authenticate, getAllQueries);
// Reply to a query (coordinator)
router.patch('/:queryId/reply', authenticate, replyToQuery);

export default router;
