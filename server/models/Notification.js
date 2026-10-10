import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["budget", "spending", "goal", "summary", "insight"],
      default: "insight",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);
schema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("Notification", schema);
