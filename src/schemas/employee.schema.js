import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z
    .string({
      required_error: "El nombre es obligatorio",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(1, { message: "El nombre debe tener mas de un carácter" })
    .max(50, { message: "El nombre debe tener menos de 50 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/, {
      message: "El nombre solo debe contener letras y espacios",
    }),
  lastName: z
    .string({
      required_error: "El apellido es obligatorio",
      invalid_type_error: "El apellido debe ser una cadena de texto",
    })
    .min(1, { message: "El apellido debe tener mas de un carácter" })
    .max(50, { message: "El apellido debe tener menos de 50 caracteres" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/, {
      message: "El apellido solo debe contener letras y espacios",
    }),
  ci: z
    .string({
      required_error: "La cédula de identidad es obligatoria",
      invalid_type_error: "La cédula de identidad debe ser una cadena de texto",
    })
    .min(5, { message: "La cédula de identidad debe tener 5 caracteres o más" })
    .max(15, {
      message: "La cédula de identidad debe tener 15 caracteres o menos",
    }),
  address: z.string({
    required_error: "La dirección es obligatoria",
    invalid_type_error: "La dirección debe ser una cadena de texto",
  }),
  phone: z
    .string({
      required_error: "El número de teléfono es obligatorio",
      invalid_type_error: "El número de teléfono debe ser una cadena de texto",
    })
    .min(5, { message: "El número de teléfono debe tener 5 caracteres o más" })
    .max(15, {
      message: "El número de teléfono debe tener 15 caracteres o menos",
    }),
  email: z
    .string({
      required_error: "El correo electrónico es obligatorio",
      invalid_type_error: "El correo electrónico debe ser una cadena de texto",
    })
    .email({ message: "Dirección de correo electrónico no válida" }),
  password: z.string({
    min_length: 6,
    max_length: 20,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,20}$/,
    required_error: "Por favor, ingrese una contraseña.",
    min_length_error: "La contraseña debe tener al menos 6 caracteres",
    max_length_error: "La contraseña no debe exceder los 20 caracteres",
    pattern_error:
      "La contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número (por ejemplo, 'Abc123').",
  }),
  staff: z.boolean({
    required_error: "El estado de staff es obligatorio",
    invalid_type_error: "El estado de staff debe ser un booleano",
  }),
  admin: z.boolean({
    required_error: "El estado de administrador es obligatorio",
    invalid_type_error: "El estado de administrador debe ser un booleano",
  }),
  roleId: z.string({
    required_error: "El estado rol es obligatorio",
    invalid_type_error: "El estado rol debe ser una cadena de texto",
  }),
});
