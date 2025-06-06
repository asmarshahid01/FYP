import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1];
	

	if (!token) {
		return res
			.status(401)
			.json({ message: 'Access denied. No token provided.' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		console.log(req.user);
		
		next();
	} catch (err) {
		res.status(401).json({ message: 'Invalid token' });
	}
};

export default authenticate;
