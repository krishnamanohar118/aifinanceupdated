import Transaction from "../models/Transaction.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  financeSummary,
  monthlySeries,
  rangeFromQuery,
  money,
} from "../services/financeService.js";
export const summary = asyncHandler(async (req, res) => {
  const data = await financeSummary(req.user.id, req.query);
  const days = Math.max(1, Math.ceil((data.end - data.start) / 86400000));
  res.json({
    success: true,
    data: {
      ...data,
      averageDailyExpense: money(data.expenses / days),
      averageMonthlyExpense: money(data.expenses / (days / 30)),
    },
  });
});
export const categories = asyncHandler(async (req, res) => {
  const data = await financeSummary(req.user.id, req.query);
  res.json({
    success: true,
    items: data.categories.map((x) => ({
      ...x,
      percentage: data.expenses ? money((x.amount / data.expenses) * 100) : 0,
    })),
  });
});
export const monthly = asyncHandler(async (req, res) =>
  res.json({
    success: true,
    items: await monthlySeries(req.user.id, Number(req.query.months) || 6),
  }),
);
export const trends = asyncHandler(async (req, res) => {
  const { start, end } = rangeFromQuery(req.query);
  const items = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        type: "Expense",
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        amount: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json({
    success: true,
    items: items.map((x) => ({ date: x._id, amount: money(x.amount) })),
  });
});
