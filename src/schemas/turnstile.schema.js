import { z } from "zod";

export const turnstileSchema = z.object({
  name: z.string({
    required_error: "El torniquete es requerido",
  }),
  description: z.string(),
});
