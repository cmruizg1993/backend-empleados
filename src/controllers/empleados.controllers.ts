import type { Request, Response } from 'express';
import type { IEmployeeRepository } from '../repositories/IEmployeeRepository.js';

/**
 * Controlador HTTP de empleados.
 * Recibe la abstracción IEmployeeRepository por constructor
 * (Inversión de Dependencias): no conoce a Mongoose ni a MongoDB,
 * por lo que puede probarse unitariamente con dobles de prueba.
 */
export class EmpleadoController {
    constructor(private readonly repository: IEmployeeRepository) {}

    getEmpleado = async (req: Request, res: Response): Promise<void> => {
        const empleados = await this.repository.getEmpleado();
        res.status(200).json(empleados);
    };

    addEmpleado = async (req: Request, res: Response): Promise<void> => {
        const nuevoEmpleado = await this.repository.addEmpleado(req.body);
        res.status(201).json({ status: 'Empleado guardado', data: nuevoEmpleado });
    };

    updateEmpleado = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const empleado = await this.repository.updateEmpleado(id as string, req.body);
        res.status(200).json({ status: 'Empleado actualizado', data: empleado });
    };

    deleteEmpleado = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        await this.repository.deleteEmpleado(id as string);
        res.status(200).json({ status: 'Empleado eliminado' });
    };
}

export default EmpleadoController;
