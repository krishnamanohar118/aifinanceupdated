import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: true },
);
schema.index({ userId: 1, createdAt: 1 });
export default mongoose.model("ChatMessage", schema);
