import { Injectable } from "@nestjs/common";
import { OrdersTransactionContext, OrdersUnitOfWork } from "../../application/ports/orders-unit-of-work.js";
import { DataSource } from "typeorm";
import { TypeOrmOrderRepository } from "./repositories/typeorm-order.repository.js";
import { OrderOrmEntity } from "./orm-entities/order.orm-entity.js";
import { TypeOrmProductRepository } from "../../../products/infrastructure/persistence/repositories/typeorm-product.repository.js";
import { ProductOrmEntity } from "../../../products/infrastructure/persistence/orm-entities/product.orm-entity.js";

@Injectable()
export class TypeOrmOrdersUnitOfWork implements OrdersUnitOfWork {
    constructor(
        private readonly dataSource: DataSource
    ) { }

    run<T>(work: (context: OrdersTransactionContext) => Promise<T>): Promise<T> {
        return this.dataSource.transaction((manager) => work({
            orders: new TypeOrmOrderRepository(manager.getRepository(OrderOrmEntity)),
            products: new TypeOrmProductRepository(manager.getRepository(ProductOrmEntity)),
        }));
    }
}