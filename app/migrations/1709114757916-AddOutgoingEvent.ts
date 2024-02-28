import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOutgoingEvent1709114757916 implements MigrationInterface {
  name = 'AddOutgoingEvent1709114757916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "translator"."outgoing_event" ("outgoing_event_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT timezone(\'utc\'::text, now()), "headers" jsonb NOT NULL DEFAULT \'{}\'::jsonb, "partition_key" text NOT NULL, "data" jsonb NOT NULL DEFAULT \'{}\'::jsonb, CONSTRAINT "outgoing_event_pkey" PRIMARY KEY ("outgoing_event_id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "translator"."outgoing_event"');
  }
}
