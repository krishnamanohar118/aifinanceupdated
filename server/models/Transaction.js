import mongoose from "mongoose";
export const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other Income",
];
export const expenseCategories = [
  "Food",
  "Shopping",
  "Transport",
  "Rent",
  "Bills",
  "Entertainment",
  "Healthcare",
  "Education",
  "Subscriptions",
  "Travel",
  "Groceries",
  "Personal Care",
  "Other",
];
export const paymentMethods = [
  "Cash",
  "UPI",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Wallet",
  "Other",
];
const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["Income", "Expense"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 140 },
    date: { type: Date, required: true, index: true },
    paymentMethod: { type: String, enum: paymentMethods, default: "UPI" },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);
schema.index({ userId: 1, date: -1 });
export default mongoose.model("Transaction", schema);
