import express from 'express';
import connect from './utils/dbConnect.js';
import studentRoutes from './routes/studentRoutes.js';
import supervisorRoutes from './routes/supervisorRoutes.js';
import postRoutes from './routes/postRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import coordinatorRoutes from './routes/coordinatorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { app,server } from './socket/socket.js';
import queryRoutes from './routes/queryRoutes.js';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDirs = [
	'./uploads/students',
	'./uploads/students/deliverables',
	'./uploads/students/profiles',
];

uploadDirs.forEach((dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		console.log(`Created directory: ${dir}`);
	}
});

await connect();

// const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));
const port = 4000;
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use('/api/student', studentRoutes);
app.use('/api/post', postRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/supervisor', supervisorRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/chats',chatRoutes);
app.use('/api/query', queryRoutes);

server.listen(port, () => {
	console.log('SERVER IS ON!!');
});
