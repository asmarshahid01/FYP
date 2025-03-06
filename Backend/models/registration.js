import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  approved: {
    type: Boolean,
    default: false,
  },
  fypGroup: {
    type: mongoose.Types.ObjectId,
    ref: "Fypgroup",
  },
  fypType: {
    type: String,
  },
  projectName: {
    type: String,
  },
  department: {
    type: String,
  },
});

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;
