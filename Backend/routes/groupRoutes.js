import {
	findGroupByStudentId,
	updateGroupById,
	leaveGroup,
	getSupervisorGroups,
	getGroupsForAdmin,
	approvalByAdmin,
	makeAdmin
} from '../controllers/groupController.js';
import express from 'express';
import authenticate from '../middleware.js';

const router = express.Router();


router.put('/assignAdmin/:id',authenticate,makeAdmin);
router.put('/approve/:id',approvalByAdmin);
router.get('/admins',getGroupsForAdmin);
router.get('/supervisor',authenticate,getSupervisorGroups);
router.get('/', authenticate, findGroupByStudentId);
router.put('/:id', authenticate, updateGroupById);
router.post('/leave', authenticate, leaveGroup);


export default router;
