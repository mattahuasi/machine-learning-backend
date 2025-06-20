import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { adminRequired } from "../middlewares/admin.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { VacationSchema } from "../schemas/vacation.schema.js";
import {
  createVacation,
  getVacations,
  getVacation,
  updateVacation,
  deleteVacation,
} from "../controllers/vacation.controller.js";

const router = new Router();
router.post(
  "/vacations",
  validateSchema(VacationSchema),
  authRequired,
  adminRequired,
  createVacation
);
router.get("/vacations", authRequired, getVacations);
router.get("/vacations/:id", authRequired, getVacation);
router.put("/vacations/:id", authRequired, adminRequired, updateVacation);
router.delete("/vacations/:id", authRequired, adminRequired, deleteVacation);

export default router;
