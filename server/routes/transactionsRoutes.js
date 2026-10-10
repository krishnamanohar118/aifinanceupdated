import { Router } from "express";
import { protect } from "../middleware/auth.js";
import * as c from "../controllers/transactionController.js";
const r = Router();
r.use(protect);
r.route("/").get(c.list).post(c.create);
r.route("/:id").get(c.getOne).put(c.update).delete(c.remove);
export default r;
