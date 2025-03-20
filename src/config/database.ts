import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "../infrastructure/database/entities/UserEntity";
import dotenv from "dotenv";
import { createDefaultUser } from "../shared/utils/createDefaultUser";
import { createDefaultAdmin } from "../shared/utils/createDefaultAdmin";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "UserIdentityDB",
  synchronize: true,
  logging: false,
  entities: [UserEntity],
  migrations: ['src/infrastructure/database/migrations/**/*.ts'],
  subscribers: [],
});

// AppDataSource.initialize()
//   .then(() => console.log("📦 Banco de dados conectado!"))
//   .catch((error) => console.error("Erro ao conectar no banco:", error));

const startApp = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Banco de dados conectado com sucesso.');

    await createDefaultAdmin();
    await createDefaultUser();
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
};

startApp();
