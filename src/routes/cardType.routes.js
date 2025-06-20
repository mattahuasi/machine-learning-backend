import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { adminRequired } from "../middlewares/admin.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { cardTypeSchema } from "../schemas/cardType.schema.js";
import {
  createCardType,
  getCardTypes,
  getCardType,
  updateCardType,
  deleteCardType,
} from "../controllers/cardType.controller.js";

const router = new Router();
router.post(
  "/card-types",
  validateSchema(cardTypeSchema),
  authRequired,
  adminRequired,
  createCardType
);
router.get("/card-types", authRequired, getCardTypes);
router.get("/card-types/:id", authRequired, getCardType);
router.put("/card-types/:id", authRequired, adminRequired, updateCardType);
router.delete("/card-types/:id", authRequired, adminRequired, deleteCardType);

export default router;
