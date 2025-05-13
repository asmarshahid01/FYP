import express from 'express';
import multer from 'multer';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkFile } from '../controllers/coordinatorController.js';
import {
	createAnnouncement,
	getMyAnnouncements,
	deleteAnnouncement,
	login,
} from '../controllers/coordinatorController.js';
import authenticate from '../middleware.js';
import { roundToNearestHours } from 'date-fns';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const upload = multer({ dest: 'uploadsLatex/' }); // Temporary upload folder

router.post('/latex/upload', upload.single('zipFile'), checkFile);
router.post('/login', login);
router.post('/announcements', authenticate, createAnnouncement);
router.get('/announcements', authenticate, getMyAnnouncements);
router.delete('/announcements/:id', authenticate, deleteAnnouncement);

export default router;
