import mongoose, { Schema } from "mongoose";

const fypgroupSchema = mongoose.Schema({
  studentsId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  supervisorId: {
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
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

const Fypgroup = mongoose.model("Fypgroup", fypgroupSchema);
export default Fypgroup;
