import { Product } from "../../../domain/entities/product.entity.js";
import { ProductOrmEntity } from "../orm-entities/product.orm-entity.js";

export class ProductMapper {
    static toDomain(row: ProductOrmEntity): Product {
        return Product.restore({
            id: row.id,
            name: row.name,
            description: row.description,
            priceCents: row.priceCents,
            stock: row.stock,
            isActive: row.isActive,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        });
    }

    static toOrm(product: Product): ProductOrmEntity {
        return Object.assign(new ProductOrmEntity(), product.toPrimitives());
    }
}