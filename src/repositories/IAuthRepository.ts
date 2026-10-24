export interface IAuthRepository {
    findByUsername(username: string): Promise<any>;
}
