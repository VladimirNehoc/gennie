import { MigrationInterface, QueryRunner } from "typeorm";

export class Name1756978494396 implements MigrationInterface {
    name = 'Name1756978494396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "updatedAt"`);
    }

}
