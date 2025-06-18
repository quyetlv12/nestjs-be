import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '255',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'business_id',
            type: 'int',
            isNullable: true,
          },
          {
            name : "avatar",
            type : "varchar",
            isNullable : true
          },
          {
            name: "availableFor24hDelivery",
            type: "boolean",
            default: false
          },
          {
            name: "lastCompletedVideoAt",
            type: "timestamp",
            isNullable: true
          },
          {
            name: "averageVideoLength",
            type: "varchar",
            isNullable: true
          },
          {
            name: "description",
            type: "text",
            isNullable: true
          },
          {
            name: "reasonsToGetAVideo",
            type: "json", // hoặc "jsonb"
            isNullable: true,
          },
          {
            name: "address",
            type: "varchar",
            isNullable: true
          },

          {
            name: "price",
            type: "int",
            isNullable: true
          },
          {
            name : "job",
            type : "varchar",
            isNullable : true
          }          
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
