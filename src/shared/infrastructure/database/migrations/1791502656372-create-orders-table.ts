import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrdersTable1791502656372 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE orders (
                id          UUID PRIMARY KEY,
                user_id     UUID        NOT NULL,
                status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                total_cents INTEGER     NOT NULL,
                created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id),
                CONSTRAINT chk_orders_status CHECK (status IN ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED')),
                CONSTRAINT chk_orders_total CHECK (total_cents >= 0)
            )
        `);
        await queryRunner.query('CREATE INDEX idx_orders_user_id ON orders (user_id)');
        await queryRunner.query('CREATE INDEX idx_orders_status_created_at ON orders (status, created_at)');

        await queryRunner.query(`
            CREATE TABLE order_items (
                id                  UUID PRIMARY KEY,
                order_id            UUID    NOT NULL,
                product_id          UUID    NOT NULL,
                quantity            INTEGER NOT NULL,
                unit_price_cents    INTEGER NOT NULL,
                CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
                CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id),
                CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
                CONSTRAINT chk_order_items_price CHECK (unit_price_cents >= 0)
            )
        `);
        await queryRunner.query('CREATE INDEX idx_order_items_order_id ON order_items (order_id)');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE order_items');
        await queryRunner.query('DROP TABLE orders');
    }

}
