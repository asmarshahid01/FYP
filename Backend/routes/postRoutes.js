import express from 'express';
import {
	createPost,
	getPostsByAuthor,
	getPosts,
} from '../controllers/postController.js';
import authenticate from '../middleware.js';

const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/', authenticate, getPosts);
router.get('/:authorId', getPostsByAuthor);

export default router;
