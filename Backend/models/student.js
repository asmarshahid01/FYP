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
	profile: {
		type: String,
	},
	status: {
		type: String,
	},
	gpa: {
		type: String,
	},
	role: {
		type: Boolean,
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
