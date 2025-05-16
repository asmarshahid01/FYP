import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
                id:{type: mongoose.Schema.Types.ObjectId},
                model:{type:String,enum:["Student","Supervisor"] ,required:true},
		},
		receiverId: {
                id:{type: mongoose.Schema.Types.ObjectId},
                model:{type:String,enum:["Student","Supervisor"] ,required:true},
		},
		message: {
			type: String,
			required: true,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;