import { Router } from 'express';
import { EmpleadoController } from '../controllers/empleados.controllers.js';
import { EmployeeMongoRepository } from '../repositories/impl/employee-mongo-repository.js';
import { validate } from '../middlewares/validate.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
    createEmpleadoSchema,
    updateEmpleadoSchema,
    deleteEmpleadoSchema,
} from '../dto/empleado.dto.js';

const router = Router();

// Cableado de dependencias: el controlador depende de la abstracción,
// aquí se inyecta la implementación concreta para MongoDB.
const empleado = new EmpleadoController(new EmployeeMongoRepository());

// Todas las rutas del CRUD requieren un JWT válido (Bearer token).
router.get('/empleados', verifyToken, empleado.getEmpleado);
router.post('/empleados', verifyToken, validate(createEmpleadoSchema), empleado.addEmpleado);
router.put('/empleados/:id', verifyToken, validate(updateEmpleadoSchema), empleado.updateEmpleado);
router.delete('/empleados/:id', verifyToken, validate(deleteEmpleadoSchema), empleado.deleteEmpleado);

export default router;