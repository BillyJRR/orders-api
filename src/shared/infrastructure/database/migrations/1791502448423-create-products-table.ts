import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1791502448423 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE products (
                id          UUID PRIMARY KEY,
                name        VARCHAR(150) NOT NULL,
                description TEXT,
                price_cents INTEGER      NOT NULL,
                stock       INTEGER      NOT NULL,
                is_active   BOOLEAN      NOT NULL DEFAULT true,
                created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
                updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
                CONSTRAINT chk_products_price CHECK (price_cents >= 0),
                CONSTRAINT chk_products_stock CHECK (stock >= 0)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE products');
    }

}
