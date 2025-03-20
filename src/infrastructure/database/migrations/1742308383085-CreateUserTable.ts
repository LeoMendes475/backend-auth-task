import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1742308383085 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'isOnboarded',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          }
        ]
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
