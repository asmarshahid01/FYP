import mongoose, { Schema } from 'mongoose';

const announcementSchema = new mongoose.Schema(
	{
		coordinator: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Supervisor',
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

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
