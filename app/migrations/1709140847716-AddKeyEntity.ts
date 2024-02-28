import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKeyEntity1709140847716 implements MigrationInterface {
  name = 'AddKeyEntity1709140847716';

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "translator"."key" DROP CONSTRAINT "key_project_id_fkey"');
    await queryRunner.query('ALTER TABLE "translator"."key" DROP CONSTRAINT "key_lang_id_fkey"');
    await queryRunner.query('DROP INDEX "translator"."unique_name_project_id_lang_id"');
    await queryRunner.query('DROP TABLE "translator"."key"');
  }
}
