import { AppDataSource } from "../../config/database";
import { UserEntity } from "../../infrastructure/database/entities/UserEntity";
import { User } from "../../domain/entities/user";

export class UserRepository {
  private repository = AppDataSource.getRepository(UserEntity);

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.repository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async save(user: UserEntity) {
    return await this.repository.update(user.id, user);
  }
}
