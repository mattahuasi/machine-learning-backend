import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { cardSchema } from "../schemas/card.schema.js";
import {
  createCard,
  getCards,
  getCardTypes,
  getCardEmployee,
  getCard,
  updateCard,
  connectCard,
  disconnectCard,
  disconnectEmployeeCard,
  deleteCard,
} from "../controllers/card.controller.js";

const router = new Router();
router.post("/cards", validateSchema(cardSchema), authRequired, createCard);
router.get("/cards", authRequired, getCards);
router.get("/cards/:id", authRequired, getCard);
router.get("/cards/employees/:id", authRequired, getCardEmployee);
router.get("/cards/card-types/:id/:userId", authRequired, getCardTypes);
router.put("/cards/:id", authRequired, updateCard);
router.put("/cards/connect/:id", authRequired, connectCard);
router.delete("/cards/connect/:id", authRequired, disconnectCard);
router.delete(
  "/cards/connect/employees/:id",
  authRequired,
  disconnectEmployeeCard
);
router.delete("/cards/:id", authRequired, deleteCard);

export default router;
