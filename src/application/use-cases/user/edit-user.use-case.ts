import { UserRepository } from "../../../adapters/repositories/UserRepository";

interface EditUserAccountParams {
    name: string;
    role?: string;
    isOnboarded?: boolean;
}

export class EditUserAccountUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId: string, { name, role, isOnboarded }: EditUserAccountParams) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Usuário não encontrado.');
        }

        user.name = name;

        if (role) {
            user.role = role;
        }

        if (isOnboarded !== undefined) {
            user.isOnboarded = isOnboarded;
        }

        await this.userRepository.save(user);

        return user;
    }
}
