import { Injectable } from "@nestjs/common";
import { Paginated, PaginationParams } from "../../../../shared/domain/pagination.js";
import { ProductPrimitives } from "../../domain/entities/product.entity.js";
import { ProductRepository } from "../../domain/repositories/product.repository.js";

@Injectable()
export class ListProductsUseCase {
    constructor(
        private readonly products: ProductRepository
    ) { }

    async execute(params: PaginationParams): Promise<Paginated<ProductPrimitives>> {
        const products = await this.products.findAll(params);
        return {
            ...products,
            items: products.items.map((product) => product.toPrimitives()),
        };
    }
}