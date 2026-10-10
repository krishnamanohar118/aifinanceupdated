import Transaction, {
  incomeCategories,
  expenseCategories,
} from "../models/Transaction.js";
import asyncHandler from "../utils/asyncHandler.js";
import { financeSummary } from "../services/financeService.js";
import { createBudgetAlerts } from "./budgetController.js";
const allowed = (type, category) =>
  (type === "Income" ? incomeCategories : expenseCategories).includes(category);
export const list = asyncHandler(async (req, res) => {
  const {
    search,
    type,
    category,
    start,
    end,
    sort = "-date",
    page = 1,
    limit = 30,
  } = req.query;
  const q = { userId: req.user.id };
  if (type) q.type = type;
  if (category) q.category = category;
  if (search)
    q.$or = [
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  if (start || end)
    q.date = {
      ...(start && { $gte: new Date(start) }),
      ...(end && { $lte: new Date(`${end}T23:59:59.999Z`) }),
    };
  const [items, total, summary] = await Promise.all([
    Transaction.find(q)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Transaction.countDocuments(q),
    financeSummary(req.user.id, { start, end }),
  ]);
  res.json({ success: true, items, total, summary });
});
export const create = asyncHandler(async (req, res) => {
  const { type, amount, category, description, date, paymentMethod, notes } =
    req.body;
  if (
    !["Income", "Expense"].includes(type) ||
    !allowed(type, category) ||
    !amount ||
    !description ||
    !date
  )
    return res
      .status(400)
      .json({ success: false, message: "Provide valid transaction details" });
  const item = await Transaction.create({
    userId: req.user.id,
    type,
    amount,
    category,
    description,
    date,
    paymentMethod,
    notes,
  });
  await createBudgetAlerts(req.user._id);
  res.status(201).json({ success: true, item });
});
export const getOne = asyncHandler(async (req, res) => {
  const item = await Transaction.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Transaction not found" });
  res.json({ success: true, item });
});
export const update = asyncHandler(async (req, res) => {
  const current = await Transaction.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!current)
    return res
      .status(404)
      .json({ success: false, message: "Transaction not found" });
  const next = { ...req.body };
  delete next.userId;
  if (next.type && next.category && !allowed(next.type, next.category))
    return res
      .status(400)
      .json({
        success: false,
        message: "Category does not match transaction type",
      });
  Object.assign(current, next);
  await current.save();
  await createBudgetAlerts(req.user._id);
  res.json({ success: true, item: current });
});
export const remove = asyncHandler(async (req, res) => {
  const item = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Transaction not found" });
  res.json({ success: true, message: "Transaction deleted" });
});
