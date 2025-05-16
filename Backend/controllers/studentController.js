import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Student from '../models/student.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { JWT_SECRET } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = './uploads/students/';
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		cb(null, `temp_${Date.now()}${path.extname(file.originalname)}`); // Temporary name
	},
});

const upload = multer({ storage });

const updateBio = async (req, res) => {
	const userID = req.user.id;
	if (!userID) {
		res.status(400).json({ message: 'Unauthorized User found', err });
	}

	const user = await Student.findById(userID);
	if (!user) {
		res.status(400).json({ message: 'No Such User exists in the system', err });
	}

	user.profile = req.body.bio;

	if (req.file) {
		const rollNumber = req.body.rollNumber;
		if (!rollNumber) {
			return res.status(400).json({ message: 'Roll number is required' });
		}

		// Get the temporary file path from multer
		const tempFilePath = req.file.path; // Check this path in logs

		// Define the upload directory
		const uploadDir = path.join(__dirname, '..', 'uploads', 'students');

		// Ensure the directory exists
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		// Generate the new file path
		const newFileName = `${rollNumber}${path.extname(req.file.originalname)}`;
		const newFilePath = path.join(uploadDir, newFileName);

		console.log('New File Path:', newFilePath);

		// **Delete old image if it exists**
		if (user.imageUrl) {
			const existingFilePath = path.join(__dirname, '..', user.imageUrl);
			if (fs.existsSync(existingFilePath)) {
				fs.unlinkSync(existingFilePath);
			}
		}

		// **Ensure the file actually exists before renaming**
		if (fs.existsSync(tempFilePath)) {
			fs.renameSync(tempFilePath, newFilePath);
		} else {
			return res
				.status(500)
				.json({ message: 'Uploaded file not found on server' });
		}

		user.imageUrl = `/uploads/students/${newFileName}`;
	}
	await user.save();
	res.status(200).json({ message: 'Updated Successfully', bio: req.body.bio });
};

const login = async (req, res) => {
	try {
		console.log(req.body);
		const { email, password } = req.body;

		const user = await Student.findOne({ email });
		console.log(user);
		if (!user) {
			return res.status(400).json({ message: 'No student with that email!' });
		}
		const isMatched = bcrypt.compareSync(password, user.password);
		if (!isMatched) {
			return res.status(400).json({ message: 'Incorrect password!' });
		}
		const token = jwt.sign({ id: user._id }, JWT_SECRET, {
			expiresIn: '8h',
		});
		const usertype = 'Student';
		const userdetails = {
			id: user._id,
			name: user.name,
			email: user.email,
			profile: user.profile,
			role: user.role,
			image:user.imageUrl,
		};
		console.log(userdetails);
		res
			.status(200)
			.json({ message: 'Login successful', token, usertype, userdetails });
	} catch (err) {
		res.status(400).json({ message: 'Some error in login', err });
	}
};

const getInfo = async (req, res) => {
	try {
		const userID = req.user.id;
		if (!userID) {
			res.status(400).json({ message: 'Unauthorized User found', err });
		}
		const user = await Student.findById(userID);
		if (!user) {
			res
				.status(400)
				.json({ message: 'No Such User exists in the system', err });
		}

		const userDetails = {
			id: user._id,
			name: user.name,
			email: user.email,
			profile: user.profile,
			imageUrl: user?.imageUrl || '',
		};

		res.status(200).json({
			message: 'Success',
			userDetails,
		});
	} catch (error) {
		res.status(400).json({ message: 'Network Error ', err });
	}
};

const getStudentbyId = async (req, res) => {
	console.log('Get Student by ID');
	try {
		const user = await Student.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: 'Student not found' });
		}
		const userDetails = {
			id: req.params.id,
			name: user.name,
			email: user.email,
			profile: user.profile,
			imageUrl: user?.imageUrl || '',
		};
		res.status(200).json({
			message: 'Success',
			userDetails,
		});
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
};



const getSupervisor=async(req,res)=>{
	// console.log("Inside getSUP");
	try{
		const userID = req.user.id;


		const results=await Student.findById(userID).populate({
			path:'groupId',
			populate:{
				path:'supervisorId'
			}
		});

		if(!results){
			return res.status(202).json({message:"Not made"});
		}
		return res.status(200).json({message:"Success",data:results.groupId.supervisorId});
	
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}

}

export { login, getInfo, updateBio, getStudentbyId, upload,getSupervisor };
