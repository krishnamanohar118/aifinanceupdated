import mongoose from "mongoose";
import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import { money } from "../services/financeService.js";
const enrich = async (userId, budget) => {
  const start = new Date(budget.year, budget.month - 1, 1),
    end = new Date(budget.year, budget.month, 1);
  const row = await Transaction.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: "Expense",
        category: budget.category,
        date: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const spent = money(row[0]?.total);
  const percentage = money((spent / budget.amount) * 100);
  return {
    ...budget.toObject(),
    spent,
    remaining: money(budget.amount - spent),
    percentage,
  };
};
export const list = asyncHandler(async (req, res) => {
  const now = new Date();
  const items = await Budget.find({
    userId: req.user.id,
    month: Number(req.query.month) || now.getMonth() + 1,
    year: Number(req.query.year) || now.getFullYear(),
  }).sort("category");
  res.json({
    success: true,
    items: await Promise.all(items.map((x) => enrich(req.user._id, x))),
  });
});
export const create = asyncHandler(async (req, res) => {
  const { category, amount, month, year } = req.body;
  if (!category || !amount || !month || !year)
    return res.status(400).json({
      success: false,
      message: "Category, amount, month and year are required",
    });
  const item = await Budget.create({
    userId: req.user.id,
    category,
    amount,
    month,
    year,
  });
  res
    .status(201)
    .json({ success: true, item: await enrich(req.user._id, item) });
});
export const update = asyncHandler(async (req, res) => {
  const item = await Budget.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Budget not found" });
  res.json({ success: true, item: await enrich(req.user._id, item) });
});
export const remove = asyncHandler(async (req, res) => {
  const item = await Budget.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Budget not found" });
  res.json({ success: true, message: "Budget deleted" });
});
export async function createBudgetAlerts(userId) {
  const budgets = await Budget.find({ userId });
  for (const b of budgets) {
    const x = await enrich(userId, b);
    if (x.percentage >= 80) {
      const exceeded = x.percentage >= 100;
      await Notification.findOneAndUpdate(
        {
          userId,
          title: exceeded
            ? `${b.category} budget exceeded`
            : `${b.category} budget almost used`,
        },
        {
          message: exceeded
            ? `You have spent ${x.percentage}% of your ${b.category} budget.`
            : `You have used ${x.percentage}% of your ${b.category} budget.`,
          type: "budget",
        },
        { upsert: true, new: true },
      );
    }
  }
}
