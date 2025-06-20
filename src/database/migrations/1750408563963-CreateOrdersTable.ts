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
            default: '24hours',
            comment: 'Phương thức giao video',
          },
          {
            name: 'talentId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'videoId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'recipient',
            type: 'enum',
            enum: ['someone_else', 'myself'],
            default: 'someone_else',
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
            default: 'pending',
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
          },
          {
            name: 'request_details',
            type: 'varchar',
          },
          {
            name: 'video_link',
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

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['talentId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['videoId'],
        referencedTableName: 'videos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('comments');
  }
}
