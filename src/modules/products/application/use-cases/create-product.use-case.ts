import { Injectable } from "@nestjs/common";
import { Product, ProductPrimitives } from "../../domain/entities/product.entity.js";
import { ProductRepository } from "../../domain/repositories/product.repository.js";

export interface CreateProductInput {
    name: string;
    description?: string | null;
    priceCents: number;
    stock: number;
}

@Injectable()
export class CreateProductUseCase {
    constructor(
        private readonly products: ProductRepository
    ) { }

    async execute(input: CreateProductInput): Promise<ProductPrimitives> {
        const product = Product.create(input);
        await this.products.save(product);
        return product.toPrimitives();
    }
}