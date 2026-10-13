import type { Paginated, PaginationParams } from '../../../../shared/domain/pagination.js';
import { Order } from '../entities/order.entity.js';

export abstract class OrderRepository {
    abstract save(order: Order): Promise<void>;
    abstract findById(id: string): Promise<Order | null>;
    abstract findByUserId(userId: string, params: PaginationParams): Promise<Paginated<Order>>;
}