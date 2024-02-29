import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeKeyEntity1709228990080 implements MigrationInterface {
  name = 'ChangeKeyEntity1709228990080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "translator"."key" DROP CONSTRAINT "key_project_id_fkey"');
    await queryRunner.query('ALTER TABLE "translator"."key" DROP CONSTRAINT "key_lang_id_fkey"');
    await queryRunner.query('DROP INDEX "translator"."unique_name_project_id_lang_id"');
    await queryRunner.query('DROP TABLE "translator"."key"');
    await queryRunner.query(
      'CREATE TABLE "translator"."translated_key" ("translated_key_id" SERIAL NOT NULL, "name" text NOT NULL, "lang_id" integer NOT NULL, "project_id" integer NOT NULL, "value" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT timezone(\'utc\'::text, now()), "updated_at" TIMESTAMP NOT NULL DEFAULT timezone(\'utc\'::text, now()), "logs" jsonb NOT NULL, "comment" text, CONSTRAINT "translated_key_id_pkey" PRIMARY KEY ("translated_key_id"))',
    );
    await queryRunner.query(
      'CREATE INDEX "translated_key_lang_id_index" ON "translator"."translated_key" ("lang_id") ',
    );
    await queryRunner.query(
      'CREATE INDEX "translated_key_project_id_index" ON "translator"."translated_key" ("project_id") ',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "unique_name_project_id_lang_id" ON "translator"."translated_key" ("name", "project_id", "lang_id") ',
    );
    await queryRunner.query('CREATE INDEX "key_name_index" ON "translator"."translated_key" USING GIN ("name") ');
    await queryRunner.query('CREATE INDEX "key_value_index" ON "translator"."translated_key" USING GIN ("value") ');
    await queryRunner.query(
      'ALTER TABLE "translator"."translated_key" ADD CONSTRAINT "translated_key_lang_id_fkey" FOREIGN KEY ("lang_id") REFERENCES "translator"."lang"("lang_id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "translator"."translated_key" ADD CONSTRAINT "translated_key_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "translator"."project"("project_id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "translator"."translated_key" DROP CONSTRAINT "translated_key_project_id_fkey"',
    );
    await queryRunner.query('ALTER TABLE "translator"."translated_key" DROP CONSTRAINT "translated_key_lang_id_fkey"');
    await queryRunner.query('DROP INDEX "translator"."key_name_index"');
    await queryRunner.query('DROP INDEX "translator"."key_value_index"');
    await queryRunner.query('DROP INDEX "translator"."unique_name_project_id_lang_id"');
    await queryRunner.query('DROP INDEX "translator"."translated_key_project_id_index"');
    await queryRunner.query('DROP INDEX "translator"."translated_key_lang_id_index"');
    await queryRunner.query('DROP TABLE "translator"."translated_key"');
    await queryRunner.query(
      'CREATE TABLE "translator"."key" ("key_id" SERIAL NOT NULL, "name" text NOT NULL, "lang_id" integer NOT NULL, "project_id" integer NOT NULL, "value" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT timezone(\'utc\'::text, now()), "updated_at" TIMESTAMP NOT NULL DEFAULT timezone(\'utc\'::text, now()), "user_id" bigint, CONSTRAINT "key_id_pkey" PRIMARY KEY ("key_id"))',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "unique_name_project_id_lang_id" ON "translator"."key" ("name", "project_id", "lang_id") ',
    );
    await queryRunner.query(
      'ALTER TABLE "translator"."key" ADD CONSTRAINT "key_lang_id_fkey" FOREIGN KEY ("lang_id") REFERENCES "translator"."lang"("lang_id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE "translator"."key" ADD CONSTRAINT "key_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "translator"."project"("project_id") ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }
}
