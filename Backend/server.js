import express from 'express';
import mongoose from 'mongoose';
import connect from './utils/dbConnect.js';
import bcrypt from 'bcrypt';
import Student from './models/student.js';
import studentRoutes from './routes/studentRoutes.js';
import cors from 'cors';

await connect();

const app = express();
app.use(express.json());
const port = 4000;
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use('/api/student', studentRoutes);

app.listen(port, () => {
	console.log('SERVER IS ON!!');
});

// const createDummyUsers = async () => {
// 	try {
// 		const hashedPassword = await bcrypt.hash('12345678', 10);

// 		const dummyUsers = [
// 			{
// 				name: 'Saad',
// 				email: 'l215344@lhr.nu.edu.pk',
// 				password: hashedPassword,
// 				role: true,
// 			},
// 			{
// 				name: 'Wahab',
// 				email: 'l215291@lhr.nu.edu.pk',
// 				password: hashedPassword,
// 				role: true,
// 			},
// 			{
// 				name: 'Asmar',
// 				email: 'l211754@lhr.nu.edu.pk',
// 				password: hashedPassword,
// 				role: true,
// 			},
// 			{
// 				name: 'Fatima',
// 				email: 'l21884@lhr.nu.edu.pk',
// 				password: hashedPassword,
// 				role: true,
// 			},
// 			{
// 				name: 'Bilal',
// 				email: 'l21774@lhr.nu.edu.pk',
// 				password: hashedPassword,
// 				role: true,
// 			},
// 		];

// 		await Student.insertMany(dummyUsers);
// 		console.log('Dummy users created successfully.');
// 	} catch (error) {
// 		console.error('Error creating dummy users:', error);
// 	}
// };

// createDummyUsers();
