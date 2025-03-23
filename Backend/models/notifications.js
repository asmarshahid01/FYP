import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      refPath: "receiverModel",
      
    },
    receiver: {
      type: Schema.Types.ObjectId,
      refPath: "receiverModel",
      
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Student", "Supervisor"]
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
