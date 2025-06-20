import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { adminRequired } from "../middlewares/admin.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { turnstileSchema } from "../schemas/turnstile.schema.js";
import {
  createTurnstile,
  getTurnstile,
  getTurnstiles,
  updateTurnstile,
} from "../controllers/turnstile.controller.js";

const router = new Router();
router.post(
  "/turnstiles",
  validateSchema(turnstileSchema),
  authRequired,
  adminRequired,
  createTurnstile
);
router.get("/turnstiles", authRequired, adminRequired, getTurnstiles);
router.get("/turnstiles/:id", authRequired, adminRequired, getTurnstile);
router.put("/turnstiles/:id", authRequired, adminRequired, updateTurnstile);

export default router;
