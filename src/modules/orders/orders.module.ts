import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersUnitOfWork } from './application/ports/orders-unit-of-work.js';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case.js';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case.js';
import { ListMyOrdersUseCase } from './application/use-cases/list-my-orders.use-case.js';
import { OrderRepository } from './domain/repositories/order.repository.js';
import { OrderItemOrmEntity, OrderOrmEntity } from './infrastructure/persistence/orm-entities/order.orm-entity.js';
import { TypeOrmOrderRepository } from './infrastructure/persistence/repositories/typeorm-order.repository.js';
import { TypeOrmOrdersUnitOfWork } from './infrastructure/persistence/typeorm-orders-unit-of-work.js';
import { OrdersController } from './presentation/http/orders.controller.js';

@Module({
    imports: [TypeOrmModule.forFeature([OrderOrmEntity, OrderItemOrmEntity])],
    controllers: [OrdersController],
    providers: [
        CreateOrderUseCase,
        GetOrderUseCase,
        ListMyOrdersUseCase,
        { provide: OrderRepository, useClass: TypeOrmOrderRepository },
        { provide: OrdersUnitOfWork, useClass: TypeOrmOrdersUnitOfWork },
    ],
})
export class OrdersModule { }