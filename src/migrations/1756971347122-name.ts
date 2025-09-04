import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1756971347122 implements MigrationInterface {
    name = 'Name1756971347122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prompts" DROP CONSTRAINT "FK_f2a138410751f2222c73e960824"`);
        await queryRunner.query(`ALTER TABLE "prompts" DROP CONSTRAINT "FK_9c954e7b29175cfcce8c2e4deb0"`);
        await queryRunner.query(`ALTER TABLE "prompts" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prompts" ALTER COLUMN "beforeImageId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prompts" ALTER COLUMN "afterImageId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD CONSTRAINT "FK_f2a138410751f2222c73e960824" FOREIGN KEY ("beforeImageId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD CONSTRAINT "FK_9c954e7b29175cfcce8c2e4deb0" FOREIGN KEY ("afterImageId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "prompts" DROP CONSTRAINT "FK_9c954e7b29175cfcce8c2e4deb0"`);
        await queryRunner.query(`ALTER TABLE "prompts" DROP CONSTRAINT "FK_f2a138410751f2222c73e960824"`);
        await queryRunner.query(`ALTER TABLE "prompts" ALTER COLUMN "afterImageId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prompts" ALTER COLUMN "beforeImageId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prompts" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD CONSTRAINT "FK_9c954e7b29175cfcce8c2e4deb0" FOREIGN KEY ("afterImageId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prompts" ADD CONSTRAINT "FK_f2a138410751f2222c73e960824" FOREIGN KEY ("beforeImageId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
