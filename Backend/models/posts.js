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
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model('Post', postSchema);
export default Post;
