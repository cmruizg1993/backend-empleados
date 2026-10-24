import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import type { ZodType } from 'zod';

/**
 * Convierte la ruta del issue de Zod en el nombre del campo que
 * envió el cliente, quitando el prefijo body/params/query.
 * Así "body.nombre" se reporta como "nombre" y el frontend puede
 * mapearlo directamente a los controles del formulario.
 */
const formatFieldPath = (path: PropertyKey[]): string => {
  const segments = path.map(String);
  const sources = ['body', 'params', 'query'];
  const first = segments[0];
  const fieldSegments =
    first !== undefined && sources.includes(first) ? segments.slice(1) : segments;
  return fieldSegments.join('.') || segments.join('.');
};

/**
 * Middleware factory que valida body, params y query del request
 * contra un schema de Zod. Si la validación falla responde 400
 * con el detalle de los errores; si pasa, reemplaza req.body
 * con los datos ya parseados (trim aplicado, campos extra eliminados).
 */
export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as { body?: unknown };

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'Error de validación',
          errors: error.issues.map((issue) => ({
            campo: formatFieldPath(issue.path),
            mensaje: issue.message,
          })),
        });
      }
      next(error);
    }
  };
