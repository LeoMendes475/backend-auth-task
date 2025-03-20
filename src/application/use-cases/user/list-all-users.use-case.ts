// Importando o repositório de usuários
import { UserRepository } from "../../../adapters/repositories/UserRepository";

class ListAllUsersUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute() {
        return this.userRepository.findAll();
    }
}

export const listAllUsersUseCase = new ListAllUsersUseCase(new UserRepository());
