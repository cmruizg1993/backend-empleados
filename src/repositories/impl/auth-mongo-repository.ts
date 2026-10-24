import Usuario from '../../models/usuario.js';
import type { IAuthRepository } from '../IAuthRepository.js';


export class AuthMongoRepository implements IAuthRepository {
    async findByUsername(username: string): Promise<any> {
        // Implementación para buscar un usuario por username en MongoDB
        return await Usuario.findOne({ username });
    }
}
