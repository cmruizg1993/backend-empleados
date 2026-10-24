export interface IEmployeeRepository {
    getEmpleado(): Promise<any>;
    addEmpleado(empleado: any): Promise<any>;
    updateEmpleado(id: string, empleado: any): Promise<any>;
    deleteEmpleado(id: string): Promise<any>;
}