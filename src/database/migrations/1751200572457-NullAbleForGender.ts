import { MigrationInterface, QueryRunner } from "typeorm";

export class NullAbleForGender1751200572457 implements MigrationInterface {
    name = 'NullAbleForGender1751200572457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "for_gender" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "for_gender" SET NOT NULL`);
    }

}
