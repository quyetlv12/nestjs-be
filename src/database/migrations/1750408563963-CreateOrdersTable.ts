import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrdersTable1750408563963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            comment: 'Email nhận thông tin đơn hàng',
          },
          {
            name: 'video_protocol_method',
            type: 'enum',
            enum: ['7days', '24hours'],
            enumName: 'orders_video_protocol_method_enum',
            default: `'24hours'`,
            comment: 'Phương thức giao video',
          },
          {
            name: 'talentId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'recipient',
            type: 'enum',
            enum: ['someone_else', 'myself'],
            enumName: 'orders_recipient_enum',
            default: `'someone_else'`,
            comment: 'Who is the video for?',
          },
          {
            name: 'for_gender',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'pending',
              'processing',
              'completed',
              'complaint',
              'resolving',
              'refunded',
              'rejected',
            ],
            enumName: 'orders_status_enum',
            default: `'pending'`,
          },
          {
            name: 'price',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'paymentMethod',
            type: 'varchar',
          },
          {
            name: 'paymentStatus',
            type: 'varchar',
          },
          {
            name: 'paymentDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'request_details',
            type: 'varchar',
          },
          {
            name: 'example_video_link',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'video_from',
            type: 'varchar',
            comment: 'Who is the video from?',
          },
          {
            name: 'video_from_gender',
            type: 'varchar',
            comment: 'Who is the video from gender?',
          },
          {
            name: 'hide_video_from',
            type: 'boolean',
            default: false,
            comment: 'Hide the video from?',
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'video_link',
            type: 'varchar',
            isNullable: false,
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

    await queryRunner.createForeignKeys('orders', [
      new TableForeignKey({
        columnNames: ['talentId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_video_protocol_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_recipient_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_status_enum"`);
  }
}
