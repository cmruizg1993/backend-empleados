import Empleado from '../../models/empleado.js';
import type { IEmployeeRepository } from '../IEmployeeRepository.js';


export class EmployeeMongoRepository implements IEmployeeRepository {
    async getEmpleado(): Promise<any> {
        // Implementación para obtener empleados desde MongoDB
        return await Empleado.find();
    }
    async addEmpleado(empleado: any): Promise<any> {
        // Implementación para agregar un empleado a MongoDB
        const newEmpleado = new Empleado(empleado);
        await newEmpleado.save();
        return newEmpleado;
    }
    async updateEmpleado(id: string, empleado: any): Promise<any> {
        // Implementación para actualizar un empleado en MongoDB
        const updatedEmpleado = await Empleado.findByIdAndUpdate(id, empleado, { new: true });
        return updatedEmpleado;
    }
    async deleteEmpleado(id: string): Promise<any> {
        // Implementación para eliminar un empleado de MongoDB
        const deletedEmpleado = await Empleado.findByIdAndDelete(id);
        return deletedEmpleado;
    }
}

