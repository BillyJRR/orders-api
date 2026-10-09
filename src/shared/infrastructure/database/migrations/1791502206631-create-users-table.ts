import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1791502206631 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id              UUID PRIMARY KEY,
                email           VARCHAR(255) NOT NULL,
                password_hash   VARCHAR(255) NOT NULL,
                full_name       VARCHAR(150) NOT NULL,
                role            VARCHAR(20)  NOT NULL DEFAULT 'customer',
                created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
                updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
                CONSTRAINT uq_users_email UNIQUE (email),
                CONSTRAINT chk_users_role CHECK (role IN ('customer', 'admin'))
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE users`);
    }
}
