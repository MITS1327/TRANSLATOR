import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectEntity1709120498834 implements MigrationInterface {
  name = 'AddProjectEntity1709120498834';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "translator"."project" ("project_id" SERIAL NOT NULL, "name" text NOT NULL, "keys_count" integer NOT NULL, CONSTRAINT "project_id_pkey" PRIMARY KEY ("project_id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "translator"."outgoing_event" ALTER COLUMN "created_at" SET DEFAULT timezone(\'utc\'::text, now())',
    );
    await queryRunner.query('ALTER TABLE "translator"."outgoing_event" ALTER COLUMN "headers" SET DEFAULT \'{}\'::jsonb');
    await queryRunner.query('ALTER TABLE "translator"."outgoing_event" ALTER COLUMN "data" SET DEFAULT \'{}\'::jsonb');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "translator"."outgoing_event" ALTER COLUMN "data" SET DEFAULT \'{}\'');
    await queryRunner.query('ALTER TABLE "translator"."outgoing_event" ALTER COLUMN "headers" SET DEFAULT \'{}\'');
    await queryRunner.query(
      'ALTER TABLE "translator"."outgoing_event" ALTER COLUMN "created_at" SET DEFAULT timezone(\'utc\', now())',
    );
    await queryRunner.query('DROP TABLE "translator"."project"');
  }
}
