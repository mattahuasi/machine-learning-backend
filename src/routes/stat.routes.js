import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import {
  getTotal,
  getEntryHour,
  getEmployeesTotal,
  getCardsTotal,
} from "../controllers/stat.controller.js";

const router = new Router();
router.get("/stats/total/:date", authRequired, getTotal);
router.get("/stats/entry-hour/:date", authRequired, getEntryHour);
router.get("/stats/employees", authRequired, getEmployeesTotal);
router.get("/stats/cards", getCardsTotal);

export default router;
