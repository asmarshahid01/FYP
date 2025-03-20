import mongoose, { Schema } from 'mongoose';

const fypgroupSchema = mongoose.Schema({
	title: {
		type: String,
	},
	type: {
		type: String,
	},
	studentsId: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Student',
		},
	],
	supervisorId: {
		type: Schema.Types.ObjectId,
		ref: 'Supervisor',
	},
	approved: {
		type: Boolean,
		default: false,
	},
	meetingCount: {
		type: Number,
		default: 0,
	},
});

const Fypgroup = mongoose.model('Fypgroup', fypgroupSchema);
export default Fypgroup;
