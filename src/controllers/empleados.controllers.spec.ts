import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Mock, Mocked } from 'jest-mock';
import type { Request, Response } from 'express';
import { EmpleadoController } from './empleados.controllers.js';
import type { IEmployeeRepository } from '../repositories/IEmployeeRepository.js';

/**
 * 🧪 Unit Test: EmpleadoController (Mantenibilidad & Testabilidad)
 * Prueba de caja blanca 100% aislada: NO importa mongoose ni toca
 * ninguna base de datos. El repositorio se sustituye por un Mock
 * de la abstracción IEmployeeRepository (Patrón Repository + DIP).
 *
 * Cobertura: 4 escenarios por endpoint (2 correctos + 2 incorrectos).
 */
describe('🧪 Unit Test: EmpleadoController (Mantenibilidad & Testabilidad)', () => {
  let controller: EmpleadoController;
  let mockRepository: Mocked<IEmployeeRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: Mock;
  let jsonMock: Mock;

  const VALID_ID = '665f1a2b3c4d5e6f7a8b9c0d';

  beforeEach(() => {
    // 1. Mock 100% aislado de la interfaz (Cero dependencia de Mongoose)
    mockRepository = {
      getEmpleado: jest.fn(),
      addEmpleado: jest.fn(),
      updateEmpleado: jest.fn(),
      deleteEmpleado: jest.fn(),
    };

    controller = new EmpleadoController(mockRepository);

    // 2. Mockear los objetos del ciclo de vida de Express
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
  });

  // ============================================================
  // GET /empleados
  // ============================================================
  describe('GET /empleados', () => {
    it('✅ Correcto 1: retorna 200 y la lista de empleados de la abstracción', async () => {
      const fakeEmployees = [
        { nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4000 },
      ];
      mockRepository.getEmpleado.mockResolvedValue(fakeEmployees);
      mockRequest = {};

      await controller.getEmpleado(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(fakeEmployees);
      expect(mockRepository.getEmpleado).toHaveBeenCalledTimes(1);
    });

    it('✅ Correcto 2: retorna 200 y un arreglo vacío cuando no hay empleados', async () => {
      mockRepository.getEmpleado.mockResolvedValue([]);
      mockRequest = {};

      await controller.getEmpleado(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([]);
      expect(mockRepository.getEmpleado).toHaveBeenCalledTimes(1);
    });

    it('❌ Incorrecto 1: propaga el error si la abstracción pierde la conexión', async () => {
      mockRepository.getEmpleado.mockRejectedValue(new Error('Fallo de conexión a la base de datos'));
      mockRequest = {};

      await expect(
        controller.getEmpleado(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Fallo de conexión a la base de datos');

      expect(mockRepository.getEmpleado).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('❌ Incorrecto 2: propaga el error si la abstracción sufre un timeout', async () => {
      mockRepository.getEmpleado.mockRejectedValue(new Error('Timeout de la consulta excedido'));
      mockRequest = {};

      await expect(
        controller.getEmpleado(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Timeout de la consulta excedido');

      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // POST /empleados
  // ============================================================
  describe('POST /empleados', () => {
    it('✅ Correcto 1: retorna 201 y el empleado creado por la abstracción', async () => {
      const fakeEmpleado = {
        _id: VALID_ID,
        nombre: 'Andrés Mendoza',
        cargo: 'Software Architect',
        departamento: 'I+D',
        sueldo: 4200,
      };
      mockRepository.addEmpleado.mockResolvedValue(fakeEmpleado);
      mockRequest = {
        body: { nombre: 'Andrés Mendoza', cargo: 'Software Architect', departamento: 'I+D', sueldo: 4200 },
      };

      await controller.addEmpleado(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'Empleado guardado', data: fakeEmpleado });
      expect(mockRepository.addEmpleado).toHaveBeenCalledWith(mockRequest.body);
      expect(mockRepository.addEmpleado).toHaveBeenCalledTimes(1);
    });

    it('✅ Correcto 2: retorna 201 con otro payload válido distinto', async () => {
      const fakeEmpleado = {
        _id: VALID_ID,
        nombre: 'Laura Gómez',
        cargo: 'QA Engineer',
        departamento: 'Calidad',
        sueldo: 2500,
      };
      mockRepository.addEmpleado.mockResolvedValue(fakeEmpleado);
      mockRequest = {
        body: { nombre: 'Laura Gómez', cargo: 'QA Engineer', departamento: 'Calidad', sueldo: 2500 },
      };

      await controller.addEmpleado(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'Empleado guardado', data: fakeEmpleado });
      expect(mockRepository.addEmpleado).toHaveBeenCalledTimes(1);
    });

    it('❌ Incorrecto 1: propaga el error si la abstracción rechaza la validación', async () => {
      mockRepository.addEmpleado.mockRejectedValue(new Error('Error de validación de Mongoose'));
      mockRequest = { body: { nombre: 'X', cargo: 'Dev', departamento: 'TI', sueldo: -500 } };

      await expect(
        controller.addEmpleado(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Error de validación de Mongoose');

      expect(mockRepository.addEmpleado).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('❌ Incorrecto 2: propaga el error si la abstracción detecta duplicado', async () => {
      mockRepository.addEmpleado.mockRejectedValue(new Error('E11000 duplicate key error'));
      mockRequest = { body: { nombre: 'Andrés Mendoza', cargo: 'Dev', departamento: 'TI', sueldo: 1000 } };

      await expect(
        controller.addEmpleado(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('E11000 duplicate key error');

      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // PUT /empleados/:id
  // ============================================================
  describe('PUT /empleados/:id', () => {
    it('✅ Correcto 1: retorna 200 y el empleado actualizado por la abstracción', async () => {
      const fakeUpdated = {
        _id: VALID_ID,
        nombre: 'Andrés Mendoza',
        cargo: 'Tech Lead',
        departamento: 'I+D',
        sueldo: 5000,
      };
      mockRepository.updateEmpleado.mockResolvedValue(fakeUpdated);
      mockRequest = { params: { id: VALID_ID }, body: { cargo: 'Tech Lead', sueldo: 5000 } };

      await controller.updateEmpleado(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'Empleado actualizado', data: fakeUpdated });
      expect(mockRepository.updateEmpleado).toHaveBeenCalledWith(VALID_ID, mockRequest.body);
      expect(mockRepository.updateEmpleado).toHaveBeenCalledTimes(1);
    });

    it('✅ Correcto 2: retorna 200 con una actualización parcial (un solo campo)', async () => {
      const fakeUpdated = { _id: VALID_ID, nombre: 'Andrés Mendoza', cargo: 'CTO', departamento: 'I+D', sueldo: 4200 };
      mockRepository.updateEmpleado.mockResolvedValue(fakeUpdated);
      mockRequest = { params: { id: VALID_ID }, body: { cargo: 'CTO' } };

      await controller.updateEmpleado(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'Empleado actualizado', data: fakeUpdated });
      expect(mockRepository.updateEmpleado).toHaveBeenCalledWith(VALID_ID, { cargo: 'CTO' });
    });

    it('❌ Incorrecto 1: propaga el error si el documento no existe', async () => {
      mockRepository.updateEmpleado.mockRejectedValue(new Error('Documento no encontrado'));
      mockRequest = { params: { id: 'id-inexistente' }, body: { cargo: 'Dev' } };

      await expect(
        controller.updateEmpleado(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Documento no encontrado');

      expect(mockRepository.updateEmpleado).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('❌ Incorrecto 2: propaga el error si el id tiene formato inválido (CastError)', async () => {
      mockRepository.updateEmpleado.mockRejectedValue(new Error('Cast to ObjectId failed'));
      mockRequest = { params: { id: '123' }, body: { sueldo: 3000 } };

      await expect(
        controller.updateEmpleado(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Cast to ObjectId failed');

      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  // ============================================================
  // DELETE /empleados/:id
  // ============================================================
  describe('DELETE /empleados/:id', () => {
    it('✅ Correcto 1: retorna 200 al eliminar un empleado de la abstracción', async () => {
      mockRepository.deleteEmpleado.mockResolvedValue({ acknowledged: true });
      mockRequest = { params: { id: VALID_ID } };

      await controller.deleteEmpleado(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'Empleado eliminado' });
      expect(mockRepository.deleteEmpleado).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.deleteEmpleado).toHaveBeenCalledTimes(1);
    });

    it('✅ Correcto 2: retorna 200 aunque la abstracción confirme con el documento eliminado', async () => {
      mockRepository.deleteEmpleado.mockResolvedValue({ _id: VALID_ID, nombre: 'Andrés Mendoza' });
      mockRequest = { params: { id: VALID_ID } };

      await controller.deleteEmpleado(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ status: 'Empleado eliminado' });
      expect(mockRepository.deleteEmpleado).toHaveBeenCalledTimes(1);
    });

    it('❌ Incorrecto 1: propaga el error si la abstracción falla al eliminar', async () => {
      mockRepository.deleteEmpleado.mockRejectedValue(new Error('Error al eliminar el documento'));
      mockRequest = { params: { id: 'id-inexistente' } };

      await expect(
        controller.deleteEmpleado(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Error al eliminar el documento');

      expect(mockRepository.deleteEmpleado).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
    });

    it('❌ Incorrecto 2: propaga el error si el id tiene formato inválido (CastError)', async () => {
      mockRepository.deleteEmpleado.mockRejectedValue(new Error('Cast to ObjectId failed'));
      mockRequest = { params: { id: 'abc' } };

      await expect(
        controller.deleteEmpleado(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('Cast to ObjectId failed');

      expect(statusMock).not.toHaveBeenCalled();
    });
  });
});
