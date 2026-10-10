import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'products' })
export class ProductOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 150 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ name: 'price_cents', type: 'integer' })
    priceCents!: number;

    @Column({ type: 'integer' })
    stock!: number;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @Column({ name: 'created_at', type: 'timestamptz' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamptz' })
    updatedAt!: Date;
}