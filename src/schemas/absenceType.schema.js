import { z } from "zod";

export const absenceTypeSchema = z.object({
  name: z.string({
    required_error: "El nombre es obligatorio",
  }),
  detail: z.string(),
});
