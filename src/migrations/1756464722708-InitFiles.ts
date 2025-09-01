import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFiles1756464722708 implements MigrationInterface {
  name = "InitFiles1756464722708";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bucket" character varying(255) NOT NULL, "key" character varying(2048) NOT NULL, "url" text, "contentType" text, "size" integer, "ownerId" uuid, "meta" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a5c218dfdf6ad6092fed2230a8" ON "files" ("key") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a23484d1055e34d75b25f61679" ON "files" ("ownerId") `
    );
    await queryRunner.query(`ALTER TABLE "prompts" DROP COLUMN "previewUrl"`);
    await queryRunner.query(`ALTER TABLE "prompts" DROP COLUMN "config"`);
    await queryRunner.query(`ALTER TABLE "prompts" DROP COLUMN "isPremium"`);
    await queryRunner.query(
      `ALTER TABLE "prompts" ADD "beforeUrl" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "prompts" ADD "afterUrl" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "prompts" ADD "text" text NOT NULL DEFAULT ''`
    );
    await queryRunner.query(
      `ALTER TABLE "prompts" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prompts" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "prompts" DROP COLUMN "text"`);
    await queryRunner.query(`ALTER TABLE "prompts" DROP COLUMN "afterUrl"`);
    await queryRunner.query(`ALTER TABLE "prompts" DROP COLUMN "beforeUrl"`);
    await queryRunner.query(
      `ALTER TABLE "prompts" ADD "isPremium" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "prompts" ADD "config" jsonb NOT NULL DEFAULT '{}'`
    );
    await queryRunner.query(
      `ALTER TABLE "prompts" ADD "previewUrl" character varying`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a23484d1055e34d75b25f61679"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a5c218dfdf6ad6092fed2230a8"`
    );
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
