import { Injectable } from '@nestjs/common';
import type { UserRole } from '../../../users/domain/entities/user-role.js';
import type { OrderPrimitives } from '../../domain/entities/order.entity.js';
import { OrderNotFoundError } from '../../domain/errors/order-not-found.error.js';
import { OrderRepository } from '../../domain/repositories/order.repository.js';

export interface GetOrderInput {
    orderId: string;
    requester: { id: string; role: UserRole };
}

@Injectable()
export class GetOrderUseCase {
    constructor(
        private readonly orders: OrderRepository
    ) { }

    async execute({ orderId, requester }: GetOrderInput): Promise<OrderPrimitives> {
        const order = await this.orders.findById(orderId);
        const canView = order && (order.userId === requester.id || requester.role === 'admin');
        if (!order || !canView) {
            throw new OrderNotFoundError(orderId);
        }
        return order.toPrimitives();
    }
}