import { z } from 'zod';

/**
 * Valida que un string tenga formato de ObjectId de MongoDB
 * (24 caracteres hexadecimales).
 */
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'El id debe ser un ObjectId válido de MongoDB');

/**
 * Campos del empleado con sus reglas de validación.
 * z.object: las claves no definidas en el schema (p. ej. _id,
 * createdAt, updatedAt que envía el frontend) se ignoran
 * en lugar de rechazarse.
 */
const empleadoFieldsSchema = z.object({
  nombre: z
    .string('El nombre es obligatorio y debe ser texto')
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),

  cargo: z
    .string('El cargo es obligatorio y debe ser texto')
    .trim()
    .min(2, 'El cargo debe tener al menos 2 caracteres')
    .max(100, 'El cargo no puede superar los 100 caracteres'),

  departamento: z
    .string('El departamento es obligatorio y debe ser texto')
    .trim()
    .min(2, 'El departamento debe tener al menos 2 caracteres')
    .max(100, 'El departamento no puede superar los 100 caracteres'),

  sueldo: z
    .number('El sueldo es obligatorio y debe ser numérico')
    .positive('El sueldo debe ser un número mayor que 0'),
});

/**
 * POST /empleados — todos los campos son requeridos.
 */
export const createEmpleadoSchema = z.object({
  body: empleadoFieldsSchema,
});

/**
 * PUT /empleados/:id — los campos son opcionales (actualización parcial),
 * pero se debe enviar al menos uno. El id es obligatorio en params.
 */
export const updateEmpleadoSchema = z.object({
  body: empleadoFieldsSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Debe enviar al menos un campo para actualizar' }
  ),
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * DELETE /empleados/:id — solo se valida el id en params.
 */
export const deleteEmpleadoSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

/**
 * Tipos TypeScript inferidos desde los schemas.
 */
export type CreateEmpleadoDto = z.infer<typeof empleadoFieldsSchema>;
export type UpdateEmpleadoDto = z.infer<typeof updateEmpleadoSchema>['body'];
export type EmpleadoParamsDto = z.infer<typeof deleteEmpleadoSchema>['params'];
