import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as c from "../controllers/reportController.js";
const r = Router();
r.use(protect);
r.get("/monthly", c.monthly);
r.get("/yearly", c.yearly);
export default r;
