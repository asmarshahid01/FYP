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
	downloadSubmissions,
	checkSubmissions,
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

// Download all submissions for an assignment
router.get('/download/:assignmentId', authenticate, downloadSubmissions);

// Check submissions using 2d2.js validator
router.post('/check/:assignmentId', authenticate, checkSubmissions);

export default router;
