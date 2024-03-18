import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixCountUntranslatedKeys1710762593943 implements MigrationInterface {
  name = 'FixCountUntranslatedKeys1710762593943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION "translator"."get_untranslated_keys_count"(input_lang_id int, input_project_id int)
          RETURNS bigint
        AS $$
          SELECT count(*) FROM "translator"."translated_key"
          WHERE
              "translated_key"."project_id" = "input_project_id" AND
              "lang_id" = "input_lang_id" AND
              "translated_key"."name" = "translated_key"."value"
        $$
        LANGUAGE SQL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION "translator"."get_untranslated_keys_count"(input_lang_id int, input_project_id int)
            RETURNS bigint
        AS $$ SELECT count(*) FROM "translator"."translated_key"
        WHERE "translated_key"."project_id" = "input_project_id" AND "lang_id" = "input_lang_id" $$
        LANGUAGE SQL;
    `);
  }
}
