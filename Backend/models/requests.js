import mongoose, { Schema } from 'mongoose';

const requestSchema = new mongoose.Schema(
	{
		message: {
			type: String,
			required: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'Student',
			required: true,
		},
		receiver: {
			type: Schema.Types.ObjectId,
			refPath: 'receiverModel',
			required: true,
		},
		receiverModel: {
			type: String,
			required: true,
			enum: ['Student', 'Supervisor'],
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Request = mongoose.model('Request', requestSchema);
export default Request;
