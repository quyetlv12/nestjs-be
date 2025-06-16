import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddCreatedByToVideos1750086612775 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'videos',
      new TableColumn({
        name: 'createdById',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'videos',
      new TableForeignKey({
        columnNames: ['createdById'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user', // ⚠️ Đảm bảo đúng tên bảng
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('videos');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('createdById') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('videos', foreignKey);
      }
    }
    await queryRunner.dropColumn('videos', 'createdById');
  }
}
