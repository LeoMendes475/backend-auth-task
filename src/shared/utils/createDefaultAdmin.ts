import { UserEntity } from '../../infrastructure/database/entities/UserEntity';
import { AppDataSource } from '../../config/database'

export const createDefaultAdmin = async () => {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const existingUser = await userRepository.findOneBy({ email: 'admin@example.com' });

    if (!existingUser) {
        const defaultAdmin = new UserEntity();
        defaultAdmin.name = 'Admin';
        defaultAdmin.email = 'admin@example.com';
        defaultAdmin.role = 'admin';
        defaultAdmin.isOnboarded = true;
        defaultAdmin.createdAt = new Date();

        await userRepository.save(defaultAdmin);
        console.log('Usuário admin criado com sucesso!');
    } else {
        console.log('Usuário admin já existe.');
    }
};
