import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
	{
		participants: [
			{
				id:{type: mongoose.Schema.Types.ObjectId},
				model:{type:String,enum:["Student","Supervisor"] ,required:true},
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;