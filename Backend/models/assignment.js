import mongoose, { Schema } from 'mongoose';

const assignmentSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		deadline: {
			type: Date,
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Supervisor', // or 'Coordinator' if that's the model name
		},
	},
	{
		timestamps: true,
	}
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
