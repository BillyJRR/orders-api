import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, type Relation } from 'typeorm';

@Entity({ name: 'orders' })
export class OrderOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @Column({ type: 'varchar', length: 20 })
    status!: string;

    @Column({ name: 'total_cents', type: 'integer' })
    totalCents!: number;

    @Column({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;

    @OneToMany(() => OrderItemOrmEntity, (item) => item.order, { cascade: true, eager: true })
    items!: OrderItemOrmEntity[];
}

@Entity({ name: 'order_items' })
export class OrderItemOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({ type: 'integer' })
    quantity!: number;

    @Column({ name: 'unit_price_cents', type: 'integer' })
    unitPriceCents!: number;

    @ManyToOne(() => OrderOrmEntity, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order!: Relation<OrderOrmEntity>;
}