import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { adminRequired } from "../middlewares/admin.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { roleSchema } from "../schemas/role.schema.js";
import {
  createRole,
  getRoles,
  getRole,
  updateRole,
} from "../controllers/role.controller.js";

const router = new Router();
router.post(
  "/roles",
  validateSchema(roleSchema),
  authRequired,
  adminRequired,
  createRole
);
router.get("/roles", authRequired, getRoles);
router.get("/roles/:id", authRequired, getRole);
router.put("/roles/:id", authRequired, adminRequired, updateRole);

export default router;
