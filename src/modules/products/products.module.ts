import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductOrmEntity } from "./infrastructure/persistence/orm-entities/product.orm-entity.js";
import { ProductsController } from "./presentation/http/products.controller.js";
import { CreateProductUseCase } from "./application/use-cases/create-product.use-case.js";
import { GetProductUseCase } from "./application/use-cases/get-product.use-case.js";
import { ListProductsUseCase } from "./application/use-cases/list-products.use-case.js";
import { ProductRepository } from "./domain/repositories/product.repository.js";
import { TypeOrmProductRepository } from "./infrastructure/persistence/repositories/typeorm-product.repository.js";

@Module({
    imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
    controllers: [ProductsController],
    providers: [
        CreateProductUseCase,
        GetProductUseCase,
        ListProductsUseCase,
        { provide: ProductRepository, useClass: TypeOrmProductRepository },
    ],
})
export class ProductModule { }