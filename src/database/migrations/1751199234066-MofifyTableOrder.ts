import { MigrationInterface, QueryRunner } from "typeorm";

export class MofifyTableOrder1751199234066 implements MigrationInterface {
    name = 'MofifyTableOrder1751199234066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentMethod" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentMethod" SET NOT NULL`);
    }

}
