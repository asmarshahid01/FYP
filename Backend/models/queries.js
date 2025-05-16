import mongoose, { Schema } from 'mongoose';

const querySchema = new mongoose.Schema(
	{
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: 'authorModel',
		},
		authorModel: {
			type: String,
			required: true,
			enum: ['Student', 'Teacher', 'Supervisor'],
		},
		content: {
			type: String,
			required: true,
		},
		reply: {
			type: String,
			default: '',
		},
		repliedBy: {
			type: Schema.Types.ObjectId,
			ref: 'Coordinator',
			default: null,
		},
		resolved: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Query = mongoose.model('Query', querySchema);
export default Query;
