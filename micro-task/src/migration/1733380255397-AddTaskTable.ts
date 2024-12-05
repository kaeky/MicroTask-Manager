import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaskTable1733380255397 implements MigrationInterface {
  name = 'AddTaskTable1733380255397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."dim_task_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'DONE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "dim_task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "dueDate" TIMESTAMP NOT NULL, "prevStatus" character varying, "status" "public"."dim_task_status_enum" NOT NULL DEFAULT 'OPEN', "userId" integer, "teamId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_e8027abab2e9b323cd4d2dd803e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dim_task"`);
    await queryRunner.query(`DROP TYPE "public"."dim_task_status_enum"`);
  }
}
