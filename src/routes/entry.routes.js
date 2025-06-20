import { Router } from "express";
import { authRequired } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { entrySchema } from "../schemas/entry.schema.js";
import {
  createEntry,
  getEntries,
  getExits,
  getEntry,
  getUserEntry,
  getEntriesExits,
} from "../controllers/entry.controller.js";

const router = new Router();
router.post("/entries", validateSchema(entrySchema), authRequired, createEntry);
router.get("/entries/exits/:init/:final", authRequired, getEntriesExits);
router.get("/entries/users/:userId", authRequired, getUserEntry);
router.get("/entries/:init/:final", authRequired, getEntries);
router.get("/entries/:id", authRequired, getEntry);
router.get("/exits/:init/:final", authRequired, getExits);

export default router;
