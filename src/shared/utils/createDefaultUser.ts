import { UserEntity } from '../../infrastructure/database/entities/UserEntity';
import { AppDataSource } from '../../config/database'

export const createDefaultUser = async () => {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const existingUser = await userRepository.findOneBy({ email: 'leonardo.mendes@example.com' });

    if (!existingUser) {
        const defaultUser = new UserEntity();
        defaultUser.name = 'Leonardo Mendes';
        defaultUser.email = 'leonardo.mendes@example.com';
        defaultUser.role = 'user';
        defaultUser.isOnboarded = true;
        defaultUser.createdAt = new Date();

        await userRepository.save(defaultUser);
        console.log('Usuário padrão criado com sucesso!');
    } else {
        console.log('Usuário padrão já existe.');
    }
};
