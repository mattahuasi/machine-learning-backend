import { z } from "zod";

export const entrySchema = z.object({
  type: z.string(),
  rfid: z.number({
    required_error: "El RFID es requerido",
  }),
  userId: z.number({
    required_error: "El usuario es requerido",
  }),
});
