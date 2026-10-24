import { Router } from 'express';
import { AuthController } from '../controllers/auth.controllers.js';
import { AuthMongoRepository } from '../repositories/impl/auth-mongo-repository.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema } from '../dto/auth.dto.js';

const router = Router();

// Cableado de dependencias: el controlador depende de la abstracción,
// aquí se inyecta la implementación concreta para MongoDB.
const auth = new AuthController(new AuthMongoRepository());

router.post('/login', validate(loginSchema), auth.login);

export default router;
