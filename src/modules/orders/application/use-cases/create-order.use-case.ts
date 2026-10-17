import { Injectable } from '@nestjs/common';
import { ProductNotFoundError } from '../../../products/domain/errors/product-not-found.error.js';
import { Order, type OrderPrimitives } from '../../domain/entities/order.entity.js';
import { OrdersUnitOfWork } from '../ports/orders-unit-of-work.js';

export interface CreateOrderInput {
    userId: string;
    items: { productId: string; quantity: number }[];
}

@Injectable()
export class CreateOrderUseCase {
    constructor(
        private readonly unitOfWork: OrdersUnitOfWork
    ) { }

    execute(input: CreateOrderInput): Promise<OrderPrimitives> {
        return this.unitOfWork.run(async ({ orders, products }) => {
            const productIds = input.items.map((item) => item.productId);
            const found = await products.findByIdsForUpdate(productIds);
            const productsById = new Map(found.map((product) => [product.id, product]));

            const lines = input.items.map((item) => {
                const product = productsById.get(item.productId);
                if (!product) {
                    throw new ProductNotFoundError(item.productId);
                }
                product.decreaseStock(item.quantity);
                return {
                    productId: product.id,
                    quantity: item.quantity,
                    unitPriceCents: product.priceCents,
                };
            });

            const order = Order.create({ userId: input.userId, lines });

            for (const product of productsById.values()) {
                await products.save(product);
            }
            await orders.save(order);

            return order.toPrimitives();
        });
    }
}