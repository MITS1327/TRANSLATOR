import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQueryProject1710511777182 implements MigrationInterface {
  name = 'AddQueryProject1710511777182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION "translator"."get_untranslated_keys_count"(input_lang_id int, input_project_id int)
            RETURNS bigint
        AS $$ SELECT count(*) FROM "translator"."translated_key"
        WHERE "translated_key"."project_id" = "input_project_id" AND "lang_id" = "input_lang_id" $$
        LANGUAGE SQL;
    `);
    await queryRunner.query(`
        CREATE OR REPLACE FUNCTION "translator"."get_grouped_untranslated_keys_by_lang"(input_project_id int)
        RETURNS jsonb
        AS $$
            SELECT  jsonb_object_agg(
                        "translator"."lang".name, "translator"."get_untranslated_keys_count"("translator"."lang".lang_id, "input_project_id")
                ) AS untranslated_keys_count
            FROM "translator"."lang" $$
        LANGUAGE SQL;
    `);
    await queryRunner.query(`CREATE VIEW "translator"."query_project" AS
  SELECT
    project_id,
    name,
    keys_count,
    "translator"."get_grouped_untranslated_keys_by_lang"(project_id) AS untranslated_keys_by_lang
  FROM translator.project;
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP VIEW "translator"."query_project"');
    await queryRunner.query('DROP FUNCTION "translator"."get_grouped_untranslated_keys_by_lang"');
    await queryRunner.query('DROP FUNCTION "translator"."get_untranslated_keys_count"');
  }
}
