import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyOrderTable1751032281561 implements MigrationInterface {
    name = 'ModifyOrderTable1751032281561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."orders_paymentstatus_enum";`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'cancelled', 'paid', 'processing', 'sent_video', 'completed', 'complaint', 'resolving', 'refunded', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum_old" AS ENUM('pending', 'processing', 'completed', 'complaint', 'resolving', 'refunded', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum_old" USING "status"::"text"::"public"."orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum_old" RENAME TO "orders_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('pending', 'paid', 'failed', 'refunded')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL DEFAULT 'pending'`);
    }

}
