import { Injectable } from '@nestjs/common';
import type { Paginated } from '../../../../shared/domain/pagination.js';
import type { OrderPrimitives } from '../../domain/entities/order.entity.js';
import { OrderRepository } from '../../domain/repositories/order.repository.js';

export interface ListMyOrdersInput {
    userId: string;
    page: number;
    limit: number;
}

@Injectable()
export class ListMyOrdersUseCase {
    constructor(
        private readonly orders: OrderRepository
    ) { }

    async execute({ userId, page, limit }: ListMyOrdersInput): Promise<Paginated<OrderPrimitives>> {
        const result = await this.orders.findByUserId(userId, { page, limit });
        return {
            ...result,
            items: result.items.map((order) => order.toPrimitives()),
        };
    }
}