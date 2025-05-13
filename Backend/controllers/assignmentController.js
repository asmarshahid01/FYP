import Assignment from '../models/assignment.js';
import Submission from '../models/submission.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create a new assignment
const createAssignment = async (req, res) => {
	try {
		const { title, description, deadline } = req.body;
		const createdBy = req.user.id; // assuming authentication middleware sets req.user

		const assignment = new Assignment({
			title,
			description,
			deadline,
			createdBy,
		});
		await assignment.save();
		res.status(201).json({ message: 'Assignment created', assignment });
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to create assignment', details: error.message });
	}
};

// Get all assignments (optionally filter by creator)
const getAssignments = async (req, res) => {
	try {
		const assignments = await Assignment.find().sort({ createdAt: -1 });
		res.status(200).json(assignments);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch assignments', details: error.message });
	}
};

// Get a single assignment by ID
const getAssignmentById = async (req, res) => {
	try {
		const { id } = req.params;
		const assignment = await Assignment.findById(id);
		if (!assignment)
			return res.status(404).json({ error: 'Assignment not found' });
		res.status(200).json(assignment);
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to fetch assignment', details: error.message });
	}
};

// Update an assignment
const updateAssignment = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, deadline } = req.body;
		const assignment = await Assignment.findByIdAndUpdate(
			id,
			{ title, description, deadline },
			{ new: true }
		);
		if (!assignment)
			return res.status(404).json({ error: 'Assignment not found' });
		res.status(200).json({ message: 'Assignment updated', assignment });
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to update assignment', details: error.message });
	}
};

// Delete an assignment
const deleteAssignment = async (req, res) => {
	try {
		const { id } = req.params;
		const assignment = await Assignment.findByIdAndDelete(id);
		if (!assignment)
			return res.status(404).json({ error: 'Assignment not found' });
		res.status(200).json({ message: 'Assignment deleted' });
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to delete assignment', details: error.message });
	}
};

// Set up multer for deliverable uploads
const deliverableUploadDir = path.join(
	process.cwd(),
	'uploads',
	'students',
	'deliverables'
);
if (!fs.existsSync(deliverableUploadDir)) {
	fs.mkdirSync(deliverableUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, deliverableUploadDir);
	},
	filename: (req, file, cb) => {
		// Create a unique filename with timestamp and original extension
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(
			null,
			`${req.user.id}_${uniqueSuffix}${path.extname(file.originalname)}`
		);
	},
});

// Configure multer with file filter
const fileFilter = (req, file, cb) => {
	// Accept only specific file types
	const allowedTypes = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/zip',
		'application/x-rar-compressed',
		'application/x-7z-compressed',
		'text/plain',
		'application/x-tex',
	];

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new Error(
				'Invalid file type. Only PDF, DOC, DOCX, ZIP, RAR, 7Z, TXT, and TEX files are allowed.'
			),
			false
		);
	}
};

// Create multer instance
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit per file
		files: 5, // Maximum 5 files per upload
	},
});

// Create the middleware function
export const deliverableUpload = (req, res, next) => {
	upload.array('files', 5)(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			return res.status(400).json({ error: err.message });
		} else if (err) {
			return res.status(500).json({ error: err.message });
		}
		next();
	});
};

// Get all submissions for the logged-in student
export const getStudentSubmissions = async (req, res) => {
	try {
		const studentId = req.user.id;
		console.log('Fetching submissions for student:', studentId);

		if (!studentId) {
			return res.status(400).json({ error: 'Student ID not found in token' });
		}

		// Get all submissions without aggregation first
		const submissions = await Submission.find({ student: studentId })
			.populate('assignment', '_id title description deadline')
			.sort({ submittedAt: -1 });

		// Group submissions by assignment
		const groupedSubmissions = submissions.reduce((acc, submission) => {
			const assignmentId = submission.assignment._id.toString();
			if (!acc[assignmentId]) {
				acc[assignmentId] = {
					assignment: submission.assignment,
					files: [],
					submittedAt: submission.submittedAt,
				};
			}
			acc[assignmentId].files.push({
				fileUrl: submission.fileUrl,
				_id: submission._id,
			});
			return acc;
		}, {});

		console.log(
			'Found submissions:',
			JSON.stringify(groupedSubmissions, null, 2)
		);
		res.status(200).json(Object.values(groupedSubmissions));
	} catch (error) {
		console.error('Error in getStudentSubmissions:', error);
		res.status(500).json({
			error: 'Failed to fetch submissions',
			details: error.message,
		});
	}
};

// Submit a deliverable
export const submitDeliverable = async (req, res) => {
	try {
		console.log('Submit request received:', {
			files: req.files,
			body: req.body,
		});

		const studentId = req.user.id;
		const { assignmentId } = req.body;

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ error: 'No files uploaded' });
		}

		if (!assignmentId) {
			return res.status(400).json({ error: 'Assignment ID is required' });
		}

		// Remove previous submissions for this assignment/student
		await Submission.deleteMany({
			assignment: assignmentId,
			student: studentId,
		});

		// Create a submission for each file
		const submissions = await Promise.all(
			req.files.map(async (file) => {
				const submission = new Submission({
					assignment: assignmentId,
					student: studentId,
					fileUrl: `/uploads/students/deliverables/${file.filename}`,
					submittedAt: new Date(),
				});
				return submission.save();
			})
		);

		console.log('Submissions created:', submissions);

		res.status(201).json({
			message: 'Deliverables submitted successfully',
			submissions,
		});
	} catch (error) {
		console.error('Error in submitDeliverable:', error);

		// If there was an error, try to clean up any uploaded files
		if (req.files) {
			req.files.forEach((file) => {
				const filePath = path.join(deliverableUploadDir, file.filename);
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}
			});
		}

		res.status(500).json({
			error: 'Failed to submit deliverable',
			details: error.message,
		});
	}
};

// Unsubmit a deliverable
export const unsubmitDeliverable = async (req, res) => {
	try {
		const studentId = req.user.id;
		const { assignmentId, submissionIds } = req.body;

		// Delete all submissions for this assignment
		const submissions = await Submission.find({
			assignment: assignmentId,
			student: studentId,
		});

		// Delete the files from the filesystem
		for (const submission of submissions) {
			if (submission.fileUrl) {
				const filePath = path.join(process.cwd(), submission.fileUrl);
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}
			}
		}

		// Delete all submissions from the database
		await Submission.deleteMany({
			assignment: assignmentId,
			student: studentId,
		});

		res.status(200).json({ message: 'Deliverable unsubmitted' });
	} catch (error) {
		console.error('Error in unsubmitDeliverable:', error);
		res.status(500).json({
			error: 'Failed to unsubmit deliverable',
			details: error.message,
		});
	}
};

export {
	createAssignment,
	getAssignments,
	getAssignmentById,
	updateAssignment,
	deleteAssignment,
};
