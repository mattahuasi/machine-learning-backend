import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { adminRequired } from "../middlewares/admin.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { absenceSchema } from "../schemas/absence.schema.js";
import {
  createAbsence,
  getAbsences,
  getAbsence,
  updateAbsence,
  deleteAbsence,
} from "../controllers/absence.controller.js";

const router = new Router();
router.post(
  "/absences",
  validateSchema(absenceSchema),
  authRequired,
  adminRequired,
  createAbsence
);
router.get("/absences", authRequired, getAbsences);
router.get("/absences/:id", authRequired, getAbsence);
router.put("/absences/:id", authRequired, adminRequired, updateAbsence);
router.delete("/absences/:id", authRequired, adminRequired, deleteAbsence);

export default router;
