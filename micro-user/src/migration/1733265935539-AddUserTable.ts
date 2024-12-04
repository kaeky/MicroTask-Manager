import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1733265935539 implements MigrationInterface {
  name = 'AddUserTable1733265935539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dim_user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "auth0Id" character varying NOT NULL, "status" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_50d2eb340f326d416885f8b42c2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dim_user"`);
  }
}
