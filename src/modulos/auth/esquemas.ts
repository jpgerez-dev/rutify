import { z } from "zod";

export const esquemaLogin = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingresá tu email.")
    .pipe(z.email("Ingresá un email válido.")),
  password: z.string().min(1, "Ingresá tu contraseña."),
});

export type DatosLogin = z.infer<typeof esquemaLogin>;
