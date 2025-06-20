import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { adminRequired } from "../middlewares/admin.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { timeTableSchema } from "../schemas/timeTable.schema.js";
import {
  createTimeTable,
  getTimeTables,
  getTimeTable,
  updateTimeTable,
} from "../controllers/timeTable.controller.js";

const router = new Router();
router.post(
  "/time-tables",
  validateSchema(timeTableSchema),
  authRequired,
  adminRequired,
  createTimeTable
);
router.get("/time-tables", authRequired, adminRequired, getTimeTables);
router.get("/time-tables/:id", authRequired, adminRequired, getTimeTable);
router.put("/time-tables/:id", authRequired, adminRequired, updateTimeTable);

export default router;
