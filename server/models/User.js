import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    currency: { type: String, default: "INR", trim: true, maxlength: 6 },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    notificationSettings: {
      budgetAlerts: { type: Boolean, default: true },
      monthlySummary: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.methods.safe = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    currency: this.currency,
    theme: this.theme,
    notificationSettings: this.notificationSettings,
    createdAt: this.createdAt,
  };
};
export default mongoose.model("User", userSchema);
