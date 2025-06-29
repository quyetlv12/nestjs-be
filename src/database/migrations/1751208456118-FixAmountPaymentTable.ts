import { MigrationInterface, QueryRunner } from "typeorm";

export class FixAmountPaymentTable1751208456118 implements MigrationInterface {
    name = 'FixAmountPaymentTable1751208456118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "amount" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "amount" bigint NOT NULL`);
    }

}
