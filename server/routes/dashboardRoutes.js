import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { get } from "../controllers/dashboardController.js";
const r = Router();
r.get("/", protect, get);
export default r;
