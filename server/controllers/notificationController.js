import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
export const list = asyncHandler(async (req, res) => {
  const items = await Notification.find({ userId: req.user.id })
    .sort("-createdAt")
    .limit(100);
  res.json({
    success: true,
    items,
    unread: items.filter((x) => !x.read).length,
  });
});
export const read = asyncHandler(async (req, res) => {
  const item = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { read: true },
    { new: true },
  );
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Notification not found" });
  res.json({ success: true, item });
});
