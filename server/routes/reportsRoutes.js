import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as c from "../controllers/reportController.js";

const r = Router();

r.use(protect);

// Monthly report
r.get("/monthly", c.monthly);

// Yearly report
r.get("/yearly", c.yearly);

export default r;