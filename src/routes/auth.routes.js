import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import {
  login,
  logout,
  profile,
  updateProfile,
  verifyToken,
  updatePassword,
} from "../controllers/auth.controller.js";

const router = new Router();

router.post("/auth/login", validateSchema(loginSchema), login);
router.post("/auth/logout", authRequired, logout);
router.get("/auth/verify-token", verifyToken);
router.get("/auth/profile", authRequired, profile);
router.put("/auth/update/profile", authRequired, updateProfile);
router.put("/auth/update/password", authRequired, updatePassword);

export default router;
