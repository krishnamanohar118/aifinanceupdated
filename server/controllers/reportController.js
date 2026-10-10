import Transaction from "../models/Transaction.js";
import asyncHandler from "../utils/asyncHandler.js";
import { financeSummary, rangeFromQuery } from "../services/financeService.js";
async function report(req, res, query) {
  const summary = await financeSummary(req.user.id, query);
  const { start, end } = rangeFromQuery(query);
  const transactions = await Transaction.find({
    userId: req.user.id,
    date: { $gte: start, $lt: end },
  }).sort("-date");
  res.json({
    success: true,
    report: {
      period: { start, end },
      summary,
      categories: summary.categories,
      transactions,
    },
  });
}
export const monthly = asyncHandler(async (req, res) =>
  report(req, res, {
    start:
      req.query.start ||
      `${req.query.year || new Date().getFullYear()}-${String(req.query.month || new Date().getMonth() + 1).padStart(2, "0")}-01`,
    end:
      req.query.end ||
      new Date(
        Number(req.query.year) || new Date().getFullYear(),
        Number(req.query.month) || new Date().getMonth() + 1,
        1,
      )
        .toISOString()
        .slice(0, 10),
  }),
);
export const yearly = asyncHandler(async (req, res) => {
  const y = Number(req.query.year) || new Date().getFullYear();
  return report(req, res, { start: `${y}-01-01`, end: `${y + 1}-01-01` });
});
