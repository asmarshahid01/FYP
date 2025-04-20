import express from 'express';
import multer from 'multer';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkFile } from '../controllers/coordinatorController.js';




const router=express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const upload = multer({ dest: 'uploadsLatex/' }); // Temporary upload folder


router.post("/latex/upload",upload.single('zipFile'),checkFile);


export default router;