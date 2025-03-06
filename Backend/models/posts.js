import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: "Supervisor",
    },
    content: {
      type: String,
    },
    requests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);
