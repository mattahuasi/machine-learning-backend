import { z } from "zod";

export const cardTypeSchema = z.object({
  name: z.string({
    required_error: "El tipo de tarjeta es requerido",
  }),
  color: z.string(),
  description: z.string(),
});
