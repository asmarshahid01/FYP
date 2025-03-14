import mongoose, { Schema } from 'mongoose';

const postSchema = new mongoose.Schema(
	{
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: 'authorModel',
		},
		authorModel: {
			type: String,
			required: true,
			enum: ['Student', 'Teacher'],
		},
		content: {
			type: String,
			required: true,
		},
		requests: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Student',
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model('Post', postSchema);
export default Post;
