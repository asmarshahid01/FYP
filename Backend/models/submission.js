import mongoose, { Schema } from 'mongoose';

const submissionSchema = new mongoose.Schema({
	assignment: {
		type: Schema.Types.ObjectId,
		ref: 'Assignment',
		required: true,
	},
	student: {
		type: Schema.Types.ObjectId,
		ref: 'Student',
		required: true,
	},
	fileUrl: {
		type: String,
		required: true,
	},
	submittedAt: {
		type: Date,
		default: Date.now,
	},
});

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
