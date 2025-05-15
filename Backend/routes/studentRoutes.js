import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';



import {
	getInfo,
	login,
	updateBio,
	getStudentbyId,
	upload,
	getSupervisor
} from '../controllers/studentController.js';
import authenticate from '../middleware.js';

const router = express.Router();


router.post('/login', login);
router.get('/info', authenticate, getInfo);
router.put('/updateBio', authenticate,upload.single("image"),updateBio);
router.get('/:id', getStudentbyId);
router.get('/getSupervisor/get',authenticate,getSupervisor);

export default router;
