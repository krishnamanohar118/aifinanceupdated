import User from "../models/User.js";
import { issueToken } from "../utils/token.js";
export async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password)
    return res
      .status(400)
      .json({
        success: false,
        message: "Name, email and password are required",
      });
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  if (password.length < 8)
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must be at least 8 characters",
      });
  if (await User.exists({ email: email.toLowerCase() }))
    return res
      .status(409)
      .json({
        success: false,
        message: "An account with this email already exists",
      });
  const user = await User.create({ name, email, password });
  res
    .status(201)
    .json({ success: true, token: issueToken(user.id), user: user.safe() });
}
export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: String(email).toLowerCase(),
  }).select("+password");
  if (!user || !(await user.comparePassword(password || "")))
    return res
      .status(401)
      .json({ success: false, message: "Incorrect email or password" });
  res.json({ success: true, token: issueToken(user.id), user: user.safe() });
}
export async function me(req, res) {
  res.json({ success: true, user: req.user.safe() });
}
export async function logout(_req, res) {
  res.json({ success: true, message: "Logged out" });
}
