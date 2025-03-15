import express from 'express';
import { getInfo, login ,updateBio} from '../controllers/studentController.js';
import authenticate from '../middleware.js';

const router = express.Router();

router.post('/login', login);
router.get("/info",authenticate,getInfo);
router.put("/updateBio",authenticate,updateBio);

export default router;
