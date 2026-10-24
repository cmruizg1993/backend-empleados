import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { IAuthRepository } from '../repositories/IAuthRepository.js';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/auth.js';

/**
 * Controlador HTTP de autenticación.
 * Recibe la abstracción IAuthRepository por constructor
 * (Inversión de Dependencias): no conoce a Mongoose ni a MongoDB,
 * por lo que puede probarse unitariamente con dobles de prueba.
 */
export class AuthController {
    constructor(private readonly repository: IAuthRepository) {}

    login = async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;

        const usuario = await this.repository.findByUsername(username);
        if (!usuario) {
            res.status(401).json({ status: 'Credenciales inválidas' });
            return;
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            res.status(401).json({ status: 'Credenciales inválidas' });
            return;
        }

        const token = jwt.sign(
            { id: usuario._id.toString(), username: usuario.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({ status: 'Login exitoso', token });
    };
}

export default AuthController;
