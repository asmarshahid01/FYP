import { truncateSync } from 'fs';
import mongoose, { Schema } from 'mongoose';

const studentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	imageUrl: {
		type: String,
	},
	profile: {
		type: String,
		default:"Student of Fast"
	},
	status: {
		type: String,
		default:"Empty"
	},
	gpa: {
		type: String,
	},
	role: {
		type: Boolean,
		default:true,
	},
	groupId: {
		type: Schema.Types.ObjectId,
		ref: 'Fypgroup',
	},
	requests: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Student',
		},
	],
	notifications: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Notification',
		},
	],
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
