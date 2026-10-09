import { Paginated, PaginationParams } from "../../../../shared/domain/pagination.js";
import { Product } from "../entities/product.entity.js";

export abstract class ProductRepository {
    abstract save(product: Product): Promise<void>;
    abstract findById(id: string): Promise<Product | null>;
    abstract findAll(params: PaginationParams): Promise<Paginated<Product>>;
}