import { Injectable } from "@nestjs/common";
import { OrderRepository } from "../../../domain/repositories/order.repository.js";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderOrmEntity } from "../orm-entities/order.orm-entity.js";
import { Repository } from "typeorm";
import { Order } from "../../../domain/entities/order.entity.js";
import { OrderMapper } from "../mappers/order.mapper.js";
import type { PaginationParams, Paginated } from "../../../../../shared/domain/pagination.js";

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
    constructor(
        @InjectRepository(OrderOrmEntity)
        private readonly repository: Repository<OrderOrmEntity>
    ) { }

    async save(order: Order): Promise<void> {
        await this.repository.save(OrderMapper.toOrm(order));
    }

    async findById(id: string): Promise<Order | null> {
        const row = await this.repository.findOne({ where: { id } });
        return row ? OrderMapper.toDomain(row) : null;
    }

    async findByUserId(userId: string, { page, limit }: PaginationParams): Promise<Paginated<Order>> {
        const [rows, total] = await this.repository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            items: rows.map((row) => OrderMapper.toDomain(row)),
            total,
            page,
            limit
        };
    }
}