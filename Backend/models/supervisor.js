import mongoose, { Schema } from "mongoose";

const supervisorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  imageUrl:{
    type:String,
    default:"",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fypCount: {
    type: Number,
  },
  requests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
});

const Supervisor = mongoose.model("Supervisor", supervisorSchema);
export default Supervisor;
