import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLangEntity1709128036857 implements MigrationInterface {
  name = 'AddLangEntity1709128036857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "translator"."lang" ("lang_id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "lang_id_pkey" PRIMARY KEY ("lang_id"))',
    );
    await queryRunner.query('CREATE UNIQUE INDEX "unq_lang_name" ON "translator"."lang" ("name") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "translator"."unq_lang_name"');
    await queryRunner.query('DROP TABLE "translator"."lang"');
  }
}
