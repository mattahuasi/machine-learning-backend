import { z } from "zod";

// Expresión regular para el formato de fecha YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const VacationSchema = z.object({
  start: z.string().regex(dateRegex),
  end: z.string().regex(dateRegex),
  dateRequested: z.string().regex(dateRegex),
  status: z.string(),
  observations: z.string(),
  employeeId: z.string(),
});
