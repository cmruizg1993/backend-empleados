import { z } from 'zod';

/**
 * Campos de credenciales con sus reglas de validación.
 * z.object: las claves no definidas en el schema se ignoran
 * en lugar de rechazarse.
 */
const credencialesSchema = z.object({
  username: z
    .string('El username es obligatorio y debe ser texto')
    .trim()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(50, 'El username no puede superar los 50 caracteres'),

  password: z
    .string('El password es obligatorio y debe ser texto')
    .min(6, 'El password debe tener al menos 6 caracteres')
    .max(100, 'El password no puede superar los 100 caracteres'),
});

/**
 * POST /login — ambos campos son requeridos.
 */
export const loginSchema = z.object({
  body: credencialesSchema,
});

/**
 * Tipos TypeScript inferidos desde los schemas.
 */
export type LoginDto = z.infer<typeof credencialesSchema>;
