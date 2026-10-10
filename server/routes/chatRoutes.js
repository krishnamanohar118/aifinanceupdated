import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as c from "../controllers/chatController.js";
const r = Router();
r.use(protect);
r.route("/").post(c.chat);
r.route("/history").get(c.history).delete(c.clear);
export default r;
