import Assignment from '../models/assignment.js';
import Submission from '../models/submission.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PDFValidator } from '../utils/2d2.js';
import { createObjectCsvWriter } from 'csv-writer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

// Create multer instance for initial upload
const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, deliverableUploadDir);
		},
		filename: (req, file, cb) => {
			// Create a temporary filename to avoid conflicts
			const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
			cb(null, `${uniqueSuffix}-${file.originalname}`);
		},
	}),
	fileFilter: fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit per file
		files: 5, // Maximum 5 files per upload
	},
});

// Create the middleware function
export const deliverableUpload = async (req, res, next) => {
	try {
		// First handle the file upload
		upload.array('files', 5)(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				return res.status(400).json({ error: err.message });
			} else if (err) {
				return res.status(500).json({ error: err.message });
			}

			// After file upload, check assignmentId
			const { assignmentId } = req.body;
			if (!assignmentId) {
				// Clean up uploaded files if assignmentId is missing
				if (req.files) {
					req.files.forEach((file) => {
						const filePath = path.join(deliverableUploadDir, file.filename);
						if (fs.existsSync(filePath)) {
							fs.unlinkSync(filePath);
						}
					});
				}
				return res.status(400).json({ error: 'Assignment ID is required' });
			}

			// Get assignment title from the database
			const assignment = await Assignment.findById(assignmentId);
			if (!assignment) {
				// Clean up uploaded files if assignment not found
				if (req.files) {
					req.files.forEach((file) => {
						const filePath = path.join(deliverableUploadDir, file.filename);
						if (fs.existsSync(filePath)) {
							fs.unlinkSync(filePath);
						}
					});
				}
				return res.status(404).json({ error: 'Assignment not found' });
			}

			// Create a safe directory name from the assignment title
			const safeDirName = assignment.title
				.replace(/[^a-z0-9]/gi, '_')
				.toLowerCase();
			const assignmentDir = path.join(deliverableUploadDir, safeDirName);

			// Create the directory if it doesn't exist
			if (!fs.existsSync(assignmentDir)) {
				fs.mkdirSync(assignmentDir, { recursive: true });
			}

			// Move files to the correct directory
			for (const file of req.files) {
				const oldPath = path.join(deliverableUploadDir, file.filename);
				const newPath = path.join(assignmentDir, file.originalname);

				// Check if file already exists in destination
				if (fs.existsSync(newPath)) {
					// Add timestamp to filename to make it unique
					const timestamp = Date.now();
					const ext = path.extname(file.originalname);
					const baseName = path.basename(file.originalname, ext);
					const newFileName = `${baseName}_${timestamp}${ext}`;
					const finalPath = path.join(assignmentDir, newFileName);
					fs.renameSync(oldPath, finalPath);
					file.filename = newFileName;
				} else {
					fs.renameSync(oldPath, newPath);
					file.filename = file.originalname;
				}
			}

			next();
		});
	} catch (error) {
		console.error('Error in deliverableUpload middleware:', error);
		res.status(500).json({ error: error.message });
	}
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

		// Get assignment title for the file path
		const assignment = await Assignment.findById(assignmentId);
		if (!assignment) {
			return res.status(404).json({ error: 'Assignment not found' });
		}

		const safeDirName = assignment.title
			.replace(/[^a-z0-9]/gi, '_')
			.toLowerCase();

		// Remove previous submissions for this assignment/student
		const oldSubmissions = await Submission.find({
			assignment: assignmentId,
			student: studentId,
		});

		// Delete old files from filesystem
		for (const submission of oldSubmissions) {
			if (submission.fileUrl) {
				const filePath = path.join(process.cwd(), submission.fileUrl);
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}
			}
		}

		// Delete old submissions from database
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
					fileUrl: `/uploads/students/deliverables/${safeDirName}/${file.filename}`,
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

// Download all submissions for an assignment
export const downloadSubmissions = async (req, res) => {
	try {
		const { assignmentId } = req.params;

		// Get assignment details
		const assignment = await Assignment.findById(assignmentId);
		if (!assignment) {
			return res.status(404).json({ error: 'Assignment not found' });
		}

		// Create a safe directory name from the assignment title
		const safeDirName = assignment.title
			.replace(/[^a-z0-9]/gi, '_')
			.toLowerCase();
		const assignmentDir = path.join(
			process.cwd(),
			'uploads',
			'students',
			'deliverables',
			safeDirName
		);

		// Check if directory exists
		if (!fs.existsSync(assignmentDir)) {
			return res
				.status(404)
				.json({ error: 'No submissions found for this assignment' });
		}

		// Create a zip file containing all submissions
		const archiver = (await import('archiver')).default;
		const archive = archiver('zip', {
			zlib: { level: 9 }, // Maximum compression
		});

		// Set the response headers
		res.setHeader('Content-Type', 'application/zip');
		res.setHeader(
			'Content-Disposition',
			`attachment; filename=${safeDirName}_submissions.zip`
		);

		// Pipe the archive to the response
		archive.pipe(res);

		// Add all files from the assignment directory to the zip
		archive.directory(assignmentDir, false);

		// Finalize the archive
		await archive.finalize();
	} catch (error) {
		console.error('Error in downloadSubmissions:', error);
		res.status(500).json({
			error: 'Failed to download submissions',
			details: error.message,
		});
	}
};

// Check submissions using 2d2.js validator
export const checkSubmissions = async (req, res) => {
	try {
		const { assignmentId } = req.params;
		const { checkerKey } = req.body;
		const assignment = await Assignment.findById(assignmentId);

		if (!assignment) {
			return res.status(404).json({ error: 'Assignment not found' });
		}

		// Map checkerKey to module path and type
		const checkerMap = {
			'1d2': { path: '../utils/1d2.js', type: 'pdf' },
			'1d3': { path: '../utils/1d3.js', type: 'pdf' },
			'2d1': { path: '../utils/2d1.js', type: 'image' },
			'2d2': { path: '../utils/2d2.js', type: 'pdf' },
		};

		if (!checkerMap[checkerKey]) {
			return res.status(400).json({ error: 'Invalid checker key' });
		}

		const checkerInfo = checkerMap[checkerKey];

		// Get all submissions for this assignment
		const submissions = await Submission.find({
			assignment: assignmentId,
		}).populate('student', 'name rollNumber');

		// Create a temporary directory for processing
		const tempDir = path.join(__dirname, '..', 'temp');
		if (!fs.existsSync(tempDir)) {
			fs.mkdirSync(tempDir, { recursive: true });
		}

		// Create CSV writer
		const csvWriter = createObjectCsvWriter({
			path: path.join(tempDir, 'results.csv'),
			header: [
				{ id: 'id', title: 'ID' },
				{ id: 'status', title: 'Status' },
				{ id: 'comments', title: 'Comments' },
			],
		});

		const results = [];

		for (const submission of submissions) {
			const filename = path.basename(
				submission.fileUrl,
				path.extname(submission.fileUrl)
			);

			if (!submission.fileUrl) {
				results.push({
					id: filename,
					status: 'Unsatisfactory',
					comments: 'No file found in submission.',
				});
				continue;
			}

			const filePath = path.join(process.cwd(), submission.fileUrl);

			if (!fs.existsSync(filePath)) {
				results.push({
					id: filename,
					status: 'Unsatisfactory',
					comments: `File not found at path: ${filePath}`,
				});
				continue;
			}

			try {
				if (checkerInfo.type === 'pdf') {
					// Dynamically import the correct PDFValidator
					const { PDFValidator } = await import(checkerInfo.path);
					const validator = new PDFValidator();
					await validator.loadPDF(filePath);
					await validator.validateDocumentStructure();
					await validator.validateContentQuality();
					await validator.validateReferences();
					if (validator.validateSignatures) {
						await validator.validateSignatures(filePath);
					}
					const result = validator.getFinalResult();
					results.push({
						id: filename,
						status: result.status,
						comments: result.comments.join('; '),
					});
				} else if (checkerInfo.type === 'image') {
					// For 2d1, use checkImageAndText
					const checker = require(checkerInfo.path);
					// You may need to adjust the template/target image paths as per your requirements
					const templateImagePath = 'template.png';
					const targetImagePath = filePath;
					const result = await checker.checkImageAndText(
						templateImagePath,
						targetImagePath
					);
					let status = 'Satisfactory';
					let comments = [];
					if (!result.imageFound) {
						status = 'Unsatisfactory';
						comments.push('Required image not found in submission.');
					}
					if (!result.textFound) {
						status = 'Unsatisfactory';
						comments.push('Required text not found in image.');
					}
					results.push({
						id: filename,
						status,
						comments: comments.join('; ') || 'All checks passed.',
					});
				}
			} catch (error) {
				results.push({
					id: filename,
					status: 'Error',
					comments: `Error processing file (${submission.fileUrl}): ${error.message}`,
				});
			}
		}

		await csvWriter.writeRecords(results);

		res.download(
			path.join(tempDir, 'results.csv'),
			`${assignment.title
				.replace(/[^a-z0-9]/gi, '_')
				.toLowerCase()}_results.csv`,
			(err) => {
				if (err) {
					console.error('Error sending file:', err);
				}
				fs.unlinkSync(path.join(tempDir, 'results.csv'));
			}
		);
	} catch (error) {
		console.error('Error checking submissions:', error);
		res
			.status(500)
			.json({ error: 'Failed to check submissions', details: error.message });
	}
};

export {
	createAssignment,
	getAssignments,
	getAssignmentById,
	updateAssignment,
	deleteAssignment,
};
