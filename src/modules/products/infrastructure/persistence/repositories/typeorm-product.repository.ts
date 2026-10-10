import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../../../domain/repositories/product.repository.js";
import { Repository } from "typeorm";
import { ProductOrmEntity } from "../orm-entities/product.orm-entity.js";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../../../domain/entities/product.entity.js";
import { PaginationParams, Paginated } from "../../../../../shared/domain/pagination.js";
import { ProductMapper } from "../mappers/product.mapper.js";

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
    constructor(
        @InjectRepository(ProductOrmEntity)
        private readonly repository: Repository<ProductOrmEntity>
    ) { }

    async save(product: Product): Promise<void> {
        await this.repository.save(ProductMapper.toOrm(product));
    }

    async findById(id: string): Promise<Product | null> {
        const row = await this.repository.findOne({ where: { id } });
        return row ? ProductMapper.toDomain(row) : null;
    }

    async findAll({ page, limit }: PaginationParams): Promise<Paginated<Product>> {
        const [rows, total] = await this.repository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });

        return {
            items: rows.map((row) => ProductMapper.toDomain(row)),
            total,
            page,
            limit
        };
    }
}