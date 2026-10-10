import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as c from "../controllers/notificationController.js";
const r = Router();
r.use(protect);
r.get("/", c.list);
r.put("/:id/read", c.read);
export default r;
