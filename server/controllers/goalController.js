import SavingsGoal from "../models/SavingsGoal.js";
import asyncHandler from "../utils/asyncHandler.js";
import { money } from "../services/financeService.js";
const view = (x) => {
  const goal = x.toObject();
  const now = new Date();
  const months = Math.max(
    1,
    (goal.targetDate.getFullYear() - now.getFullYear()) * 12 +
      goal.targetDate.getMonth() -
      now.getMonth() +
      1,
  );
  return {
    ...goal,
    progress: money((goal.currentAmount / goal.targetAmount) * 100),
    remaining: money(Math.max(0, goal.targetAmount - goal.currentAmount)),
    requiredMonthlySaving: money(
      Math.max(0, goal.targetAmount - goal.currentAmount) / months,
    ),
  };
};
export const list = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    items: (
      await SavingsGoal.find({ userId: req.user.id }).sort("targetDate")
    ).map(view),
  }),
);
export const create = asyncHandler(async (req, res) => {
  const { name, targetAmount, targetDate } = req.body;
  if (!name || !targetAmount || !targetDate)
    return res
      .status(400)
      .json({
        success: false,
        message: "Name, target amount and target date are required",
      });
  const item = await SavingsGoal.create({ userId: req.user.id, ...req.body });
  res.status(201).json({ success: true, item: view(item) });
});
export const update = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates.userId;
  const item = await SavingsGoal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    updates,
    { new: true, runValidators: true },
  );
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Savings goal not found" });
  res.json({ success: true, item: view(item) });
});
export const remove = asyncHandler(async (req, res) => {
  const item = await SavingsGoal.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Savings goal not found" });
  res.json({ success: true, message: "Savings goal deleted" });
});
