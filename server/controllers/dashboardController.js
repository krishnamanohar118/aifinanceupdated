import Transaction from "../models/Transaction.js";
import SavingsGoal from "../models/SavingsGoal.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  financeSummary,
  monthlySeries,
  money,
} from "../services/financeService.js";
export const get = asyncHandler(async (req, res) => {
  const [summary, recent, goals, monthly] = await Promise.all([
    financeSummary(req.user.id),
    Transaction.find({ userId: req.user.id }).sort("-date").limit(6),
    SavingsGoal.find({ userId: req.user.id }),
    monthlySeries(req.user.id, 2),
  ]);
  const totalGoalSavings = money(
    goals.reduce((sum, x) => sum + x.currentAmount, 0),
  );
  const prior = monthly.at(-2);
  const insight = summary.topCategory
    ? `${summary.topCategory.category} is your highest recorded spending category this month at ₹${summary.topCategory.amount}.`
    : "Add income or expense transactions to unlock your financial summary.";
  res.json({
    success: true,
    data: {
      ...summary,
      totalSavings: totalGoalSavings,
      recent,
      monthlySpending: summary.expenses,
      monthOverMonth: prior?.expenses
        ? money(((summary.expenses - prior.expenses) / prior.expenses) * 100)
        : null,
      insight,
    },
  });
});
