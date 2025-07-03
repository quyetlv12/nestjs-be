import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrdersAndPaymentTable1750408563963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ===== CREATE ENUMS SAFELY =====
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "orders_video_protocol_method_enum" AS ENUM ('7days', '24hours');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "orders_recipient_enum" AS ENUM ('someone_else', 'myself');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "orders_status_enum" AS ENUM (
          'pending', 'cancelled', 'paid', 'processing', 'sent_video',
          'completed', 'complaint', 'resolving', 'refunded', 'rejected'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "payment_status_enum" AS ENUM ('SUCCESS', 'FAILED', 'REFUNDED', 'HOLDING');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "payment_method_enum" AS ENUM (
          'BANK_TRANSFER', 'CREDIT_CARD', 'MOMO', 'ZALOPAY',
          'VNPAY', 'PAYPAL', 'CASH', 'SEPAY'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    // ===== CREATE TABLE: orders =====
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'type', type: 'varchar' },
          { name: 'email', type: 'varchar', isNullable: true, comment: 'Email nhận thông tin đơn hàng' },
          {
            name: 'video_protocol_method',
            type: 'enum',
            enumName: 'orders_video_protocol_method_enum',
            default: `'24hours'`,
            comment: 'Phương thức giao video',
          },
          { name: 'talentId', type: 'int', isNullable: false },
          {
            name: 'recipient',
            type: 'enum',
            enumName: 'orders_recipient_enum',
            default: `'someone_else'`,
            comment: 'Who is the video for?',
          },
          { name: 'for_gender', type: 'varchar', isNullable: true },
          { name: 'price', type: 'int', isNullable: false },
          { name: 'paymentDate', type: 'timestamp', isNullable: true },
          { name: 'request_details', type: 'varchar' },
          { name: 'example_video_link', type: 'varchar', isNullable: true },
          {
            name: 'video_from',
            type: 'varchar',
            isNullable: true,
            comment: 'Who is the video from?',
          },
          {
            name: 'video_from_gender',
            type: 'varchar',
            isNullable: true,
            comment: 'Who is the video from gender?',
          },
          {
            name: 'hide_video_from',
            type: 'boolean',
            isNullable: true,
            default: false,
            comment: 'Hide the video from?',
          },
          { name: 'userId', type: 'int', isNullable: true },
          { name: 'video_link', type: 'varchar', isNullable: true },
          {
            name: 'status',
            type: 'enum',
            enumName: 'orders_status_enum',
            default: `'pending'`,
          },
          {
            name: 'paymentMethod',
            type: 'enum',
            enumName: 'payment_method_enum',
            isNullable: true,
          },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // ===== CREATE TABLE: payment =====
    await queryRunner.query(`
      CREATE TABLE "payment" (
        "id" SERIAL PRIMARY KEY,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "amount" numeric(10,2) NOT NULL,
        "currency" character varying(3) NOT NULL DEFAULT 'VND',
        "status" "payment_status_enum" NOT NULL,
        "method" "payment_method_enum" NOT NULL,
        "transactionId" character varying(255) NOT NULL,
        "description" text,
        "metadata" json,
        "userId" integer NOT NULL,
        "talentId" integer NOT NULL
      )
    `);

    // ===== FOREIGN KEYS =====
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

    await queryRunner.query(`
      ALTER TABLE "payment"
      ADD CONSTRAINT "FK_payment_user" FOREIGN KEY ("userId") REFERENCES "user"("id")
    `);
    await queryRunner.query(`
      ALTER TABLE "payment"
      ADD CONSTRAINT "FK_payment_talent" FOREIGN KEY ("talentId") REFERENCES "user"("id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ===== DROP TABLES =====
    await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_payment_talent"`);
    await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_payment_user"`);
    await queryRunner.dropTable('payment');

    const foreignKeys = await queryRunner.getTable('orders').then(t => t?.foreignKeys || []);
    for (const fk of foreignKeys) {
      await queryRunner.dropForeignKey('orders', fk);
    }
    await queryRunner.dropTable('orders');

    // ===== DROP ENUMS SAFELY =====
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_video_protocol_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_recipient_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_method_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_status_enum"`);
  }
}
