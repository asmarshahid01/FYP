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
		res.status(200).json({ message: 'Login successful', token });
	} catch (err) {
		res.status(400).json({ message: 'Some error in login', err });
	}
};

export { login };
