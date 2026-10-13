import { ProductRepository } from "../../../products/domain/repositories/product.repository.js";
import { OrderRepository } from "../../domain/repositories/order.repository.js";

export interface OrdersTransactionContext {
    orders: OrderRepository;
    products: ProductRepository;
}

export abstract class OrdersUnitOfWork {
    abstract run<T>(work: (context: OrdersTransactionContext) => Promise<T>): Promise<T>;
}