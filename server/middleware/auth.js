import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer "))
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    const { id } = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Account no longer exists" });
    req.user = user;
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired session" });
  }
}
