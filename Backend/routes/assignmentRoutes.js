import express from 'express';
import {
	createAssignment,
	getAssignments,
	getAssignmentById,
	updateAssignment,
	deleteAssignment,
	getStudentSubmissions,
	submitDeliverable,
	unsubmitDeliverable,
	deliverableUpload,
} from '../controllers/assignmentController.js';
import authenticate from '../middleware.js';

const router = express.Router();

// Create assignment
router.post('/', authenticate, createAssignment);
// Get all assignments
router.get('/', authenticate, getAssignments);
// Student deliverable submission routes - these must come before /:id route
router.get('/submissions', authenticate, getStudentSubmissions);

// Submit route with file upload
router.post('/submit', authenticate, deliverableUpload, submitDeliverable);
router.delete('/unsubmit', authenticate, unsubmitDeliverable);

// Get assignment by id
router.get('/:id', authenticate, getAssignmentById);
// Update assignment
router.put('/:id', authenticate, updateAssignment);
// Delete assignment
router.delete('/:id', authenticate, deleteAssignment);

export default router;
