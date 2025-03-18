import express from 'express';
import authenticate from '../middleware.js';
import { search } from '../controllers/searchController.js';



const router = express.Router();

router.get("/fypSearch",authenticate,search);



export default router;