import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/auth.js';

/**
 * Middleware que protege rutas verificando el JWT enviado en el
 * header Authorization con el esquema "Bearer <token>".
 * Si el token falta, es inválido o expiró responde 401;
 * si es válido, deja el payload decodificado en res.locals.usuario
 * y continúa con la cadena de middlewares.
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'No autorizado',
      mensaje: 'Token no proporcionado. Use el header Authorization: Bearer <token>',
    });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.locals.usuario = payload;
    next();
  } catch {
    return res.status(401).json({
      status: 'No autorizado',
      mensaje: 'Token inválido o expirado',
    });
  }
};
