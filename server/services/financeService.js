import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
const objectId = (id) => new mongoose.Types.ObjectId(id);
export const money = (n) => Math.round((Number(n) || 0) * 100) / 100;
export function rangeFromQuery(query = {}) {
  const now = new Date();
  let start = query.start
    ? new Date(query.start)
    : new Date(now.getFullYear(), now.getMonth(), 1);
  let end = query.end
    ? new Date(query.end)
    : new Date(now.getFullYear(), now.getMonth() + 1, 1);
  if (query.period === "previous") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (query.period === "3m")
    start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  if (query.period === "6m")
    start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  if (query.period === "year") {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear() + 1, 0, 1);
  }
  return { start, end };
}
export async function financeSummary(userId, query = {}) {
  const { start, end } = rangeFromQuery(query);
  const match = { userId: objectId(userId), date: { $gte: start, $lt: end } };
  const rows = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);
  const income = money(rows.find((x) => x._id === "Income")?.total);
  const expenses = money(rows.find((x) => x._id === "Expense")?.total);
  const categoryRows = await Transaction.aggregate([
    { $match: { ...match, type: "Expense" } },
    { $group: { _id: "$category", amount: { $sum: "$amount" } } },
    { $sort: { amount: -1 } },
  ]);
  return {
    income,
    expenses,
    balance: money(income - expenses),
    savings: money(income - expenses),
    savingsPercentage: income ? money(((income - expenses) / income) * 100) : 0,
    topCategory: categoryRows[0]
      ? { category: categoryRows[0]._id, amount: money(categoryRows[0].amount) }
      : null,
    categories: categoryRows.map((x) => ({
      category: x._id,
      amount: money(x.amount),
    })),
    start,
    end,
  };
}
export async function monthlySeries(userId, months = 6) {
  const start = new Date();
  start.setMonth(start.getMonth() - months + 1, 1);
  start.setHours(0, 0, 0, 0);
  const data = await Transaction.aggregate([
    { $match: { userId: objectId(userId), date: { $gte: start } } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  const map = {};
  data.forEach((x) => {
    const key = `${x._id.year}-${String(x._id.month).padStart(2, "0")}`;
    map[key] ??= { month: key, income: 0, expenses: 0, savings: 0 };
    map[key][x._id.type === "Income" ? "income" : "expenses"] = money(x.total);
  });
  return Object.values(map).map((x) => ({
    ...x,
    savings: money(x.income - x.expenses),
  }));
}
