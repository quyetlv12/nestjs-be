import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
  } from 'typeorm';
  
  export class CreateUserRolesTable1700000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'user_roles',
          columns: [
            { name: 'user_id', type: 'int', isPrimary: true },
            { name: 'role_id', type: 'int', isPrimary: true },
          ],
        }),
      );
  
      await queryRunner.createForeignKey(
        'user_roles',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
  
      await queryRunner.createForeignKey(
        'user_roles',
        new TableForeignKey({
          columnNames: ['role_id'],
          referencedTableName: 'roles',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('user_roles');
    }
  }
  