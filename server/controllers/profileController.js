import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
export const get = asyncHandler(async (req, res) =>
  res.json({ success: true, user: req.user.safe() }),
);
export const update = asyncHandler(async (req, res) => {
  const { name, currency, theme, notificationSettings } = req.body;
  if (name) req.user.name = name;
  if (currency) req.user.currency = currency;
  if (theme) req.user.theme = theme;
  if (notificationSettings)
    req.user.notificationSettings = {
      ...req.user.notificationSettings,
      ...notificationSettings,
    };
  await req.user.save();
  res.json({ success: true, user: req.user.safe() });
});
export const password = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await req.user.constructor
    .findById(req.user.id)
    .select("+password");
  if (!(await bcrypt.compare(currentPassword || "", user.password)))
    return res
      .status(400)
      .json({ success: false, message: "Current password is incorrect" });
  if (!newPassword || newPassword.length < 8)
    return res
      .status(400)
      .json({
        success: false,
        message: "New password must be at least 8 characters",
      });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated" });
});
