// src/config/auth.ts
/**
 * Configuración centralizada de autenticación JWT.
 * El secreto se toma de la variable de entorno JWT_SECRET;
 * el valor por defecto solo debe usarse en desarrollo local.
 */
export const JWT_SECRET: string = process.env.JWT_SECRET ?? 'jwt_secreto_desarrollo';
export const JWT_EXPIRES_IN = '1h';
