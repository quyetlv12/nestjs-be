import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCategories1749717062211 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name : 'thumbnail',
            type : 'varchar',
            isNullable : false,
          },
          {
            name: 'slug',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'parentId',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'categories',
      new TableForeignKey({
        columnNames: ['parentId'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('categories');
    if (table) {
      const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.includes('parentId'));
      if (foreignKey) {
        await queryRunner.dropForeignKey('categories', foreignKey);
      }
    }
    await queryRunner.dropTable('categories');
  }
}
