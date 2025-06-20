import { z } from "zod";

// Función para validar el formato de fecha "YYYY-MM-DD"
function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // Formato "YYYY-MM-DD"
  return regex.test(dateString);
}

// Define el schema para Absence
export const absenceSchema = z.object({
  start: z.string().refine(isValidDateFormat, {
    message: "El formato de fecha de inicio debe ser YYYY-MM-DD",
  }),
  end: z.string().refine(isValidDateFormat, {
    message: "El formato de fecha de finalización debe ser YYYY-MM-DD",
  }),
  detail: z.string(),
  documentation: z.string(),
  employeeId: z.string(),
  absenceTypeId: z.string(),
});
