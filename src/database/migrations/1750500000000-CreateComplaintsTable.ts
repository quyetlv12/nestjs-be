import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateComplaintsTable1750500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'complaints',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'investigating', 'resolved', 'rejected'],
            enumName: 'complaints_status_enum',
            default: "'pending'",
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['low', 'medium', 'high', 'urgent'],
            enumName: 'complaints_priority_enum',
            default: "'medium'",
          },
          {
            name: 'complaintType',
            type: 'enum',
            enum: ['video_quality', 'delivery_time', 'content_issue', 'payment_issue', 'other'],
            enumName: 'complaints_type_enum',
          },
          {
            name: 'evidence',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'resolution',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'resolvedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'resolvedBy',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'orderId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'videoId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('complaints', [
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['videoId'],
        referencedTableName: 'videos',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['resolvedBy'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('complaints');
    await queryRunner.query(`DROP TYPE IF EXISTS "complaints_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "complaints_priority_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "complaints_type_enum"`);
  }
} 