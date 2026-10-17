import { Order, type OrderStatus } from '../../../domain/entities/order.entity.js';
import { OrderItemOrmEntity, OrderOrmEntity } from '../orm-entities/order.orm-entity.js';

export class OrderMapper {
    static toDomain(row: OrderOrmEntity): Order {
        return Order.restore({
            id: row.id,
            userId: row.userId,
            status: row.status as OrderStatus,
            totalCents: row.totalCents,
            items: row.items.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPriceCents: item.unitPriceCents,
            })),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }

    static toOrm(order: Order): OrderOrmEntity {
        const primitives = order.toPrimitives();

        const row = new OrderOrmEntity();
        row.id = primitives.id;
        row.userId = primitives.userId;
        row.status = primitives.status;
        row.totalCents = primitives.totalCents;
        row.createdAt = primitives.createdAt;
        row.updatedAt = primitives.updatedAt;
        row.items = primitives.items.map((item) => {
            const itemRow = new OrderItemOrmEntity();
            itemRow.id = item.id;
            itemRow.orderId = primitives.id;
            itemRow.productId = item.productId;
            itemRow.quantity = item.quantity;
            itemRow.unitPriceCents = item.unitPriceCents;
            return itemRow;
        });
        return row;
    }
}