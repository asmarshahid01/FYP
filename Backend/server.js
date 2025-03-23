import express from 'express';
import connect from './utils/dbConnect.js';
import studentRoutes from './routes/studentRoutes.js';
import supervisorRoutes from './routes/supervisorRoutes.js';
import postRoutes from './routes/postRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import notificationRoutes from "./routes/notificationRoutes.js";
import coordinatorRoutes from "./routes/coordinatorRoutes.js";

import cors from 'cors';

await connect();

const app = express();

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
app.use('/api/supervisor',supervisorRoutes);
app.use('/api/notification',notificationRoutes);
app.use('/api/coordinator',coordinatorRoutes);

app.listen(port, () => {
	console.log('SERVER IS ON!!');
});
