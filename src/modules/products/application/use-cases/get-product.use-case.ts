import { Injectable } from "@nestjs/common";
import { ProductPrimitives } from "../../domain/entities/product.entity.js";
import { ProductNotFoundError } from "../../domain/errors/product-not-found.error.js";
import { ProductRepository } from "../../domain/repositories/product.repository.js";

@Injectable()
export class GetProductUseCase {
    constructor(
        private readonly products: ProductRepository
    ) { }

    async execute(id: string): Promise<ProductPrimitives> {
        const product = await this.products.findById(id);
        if (!product) {
            throw new ProductNotFoundError(id);
        }

        return product.toPrimitives();
    }
}