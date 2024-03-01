import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsTranslatableToLang1709291263798 implements MigrationInterface {
  name = 'AddIsTranslatableToLang1709291263798';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "translator"."key_name_index"');
    await queryRunner.query('DROP INDEX "translator"."key_value_index"');
    await queryRunner.query(
      'CREATE INDEX "translated_key_name_index" ON "translator"."translated_key" USING GIN ("name") ',
    );
    await queryRunner.query(
      'CREATE INDEX "translated_key_value_index" ON "translator"."translated_key" USING GIN ("value") ',
    );
    await queryRunner.query('ALTER TABLE "translator"."lang" ADD "is_translatable" boolean NOT NULL DEFAULT true');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "translator"."lang" DROP COLUMN "is_translatable"');
    await queryRunner.query('CREATE INDEX "key_value_index" ON "translator"."translated_key" ("value") ');
    await queryRunner.query('CREATE INDEX "key_name_index" ON "translator"."translated_key" ("name") ');
    await queryRunner.query('DROP INDEX "translator"."translated_key_name_index"');
    await queryRunner.query('DROP INDEX "translator"."translated_key_value_index"');
  }
}
