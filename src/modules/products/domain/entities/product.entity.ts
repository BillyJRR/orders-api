import { randomUUID } from "node:crypto";
import { InvalidProductError } from "../errors/invalid-product.error.js";

export interface ProductPrimitives {
    id: string;
    name: string;
    description: string | null;
    priceCents: number;
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductProps {
    name: string;
    description?: string | null;
    priceCents: number;
    stock: number;
}

export class Product {
    private constructor(
        private readonly props: ProductPrimitives
    ) { }

    static create(input: CreateProductProps): Product {
        const name = input.name.trim();
        if (name.length === 0) {
            throw new InvalidProductError('The product name is required');
        }

        if (!Number.isInteger(input.priceCents) || input.priceCents < 0) {
            throw new InvalidProductError('The price must be an integer in cents greater than or equal to 0');
        }

        if (!Number.isInteger(input.stock) || input.stock < 0) {
            throw new InvalidProductError('The stock must be an integer greater than or equal to 0');
        }

        const now = new Date();

        return new Product({
            id: randomUUID(),
            name,
            description: input.description?.trim() || null,
            priceCents: input.priceCents,
            stock: input.stock,
            isActive: true,
            createdAt: now,
            updatedAt: now
        })
    }

    static restore(props: ProductPrimitives): Product {
        return new Product({ ...props });
    }

    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get priceCents(): number {
        return this.props.priceCents;
    }

    get stock(): number {
        return this.props.stock;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    toPrimitives(): ProductPrimitives {
        return { ...this.props };
    }
}