import { z } from "zod";

export const roleSchema = z.object({
  name: z.string({
    required_error: "El rol es requerido",
  }),
  description: z.string(),
});
