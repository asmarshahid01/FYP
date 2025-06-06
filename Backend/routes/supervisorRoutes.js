import express from 'express';
import authenticate from '../middleware.js';
import { getSupervisorById,login ,upload,updateBio, getInfo,getStudents} from '../controllers/supervisorController.js';

const router = express.Router();


router.post('/login',login);
router.get('/info',authenticate,getInfo);
router.get('/:id', authenticate, getSupervisorById);
router.put('/updateBio', authenticate,upload.single("image"),updateBio);
router.get('/getStudents/get',authenticate,getStudents);


export default router;