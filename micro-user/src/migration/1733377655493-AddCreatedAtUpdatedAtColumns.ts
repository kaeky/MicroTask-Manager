import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtUpdatedAtColumns1733377655493
  implements MigrationInterface
{
  name = 'AddCreatedAtUpdatedAtColumns1733377655493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dim_user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "dim_user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dim_user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "dim_user" DROP COLUMN "createdAt"`);
  }
}
