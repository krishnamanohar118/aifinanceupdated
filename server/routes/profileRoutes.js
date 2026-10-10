import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as c from "../controllers/profileController.js";
const r = Router();
r.use(protect);
r.get("/", c.get);
r.put("/", c.update);
r.put("/password", c.password);
export default r;
