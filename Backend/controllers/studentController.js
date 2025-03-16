import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Student from '../models/student.js';
const { JWT_SECRET } = process.env;

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
			name: user.name,
			email: user.email,
			profile: user.profile,
		};

		res.status(200).json({
			message: 'Success',
			userDetails,
		});
	} catch (error) {
		res.status(400).json({ message: 'Network Error ', err });
	}
};

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
	user.save();
	res.status(200).json({ message: 'Updated Successfully', bio: req.body.bio });
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
		};
		res.status(200).json({
			message: 'Success',
			userDetails,
		});
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
};

export { login, getInfo, updateBio, getStudentbyId };
