import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { adminRequired } from "../middlewares/admin.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { absenceTypeSchema } from "../schemas/absenceType.schema.js";
import {
  createAbsenceType,
  getAbsenceTypes,
  getAbsenceType,
  updateAbsenceType,
  deleteAbsenceType,
} from "../controllers/absenceType.controller.js";

const router = new Router();
router.post(
  "/absence-types",
  validateSchema(absenceTypeSchema),
  authRequired,
  adminRequired,
  createAbsenceType
);
router.get("/absence-types", authRequired, getAbsenceTypes);
router.get("/absence-types/:id", authRequired, getAbsenceType);
router.put(
  "/absence-types/:id",
  authRequired,
  adminRequired,
  updateAbsenceType
);
router.delete(
  "/absence-types/:id",
  authRequired,
  adminRequired,
  deleteAbsenceType
);

export default router;
