import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateProductUseCase } from "../../application/use-cases/create-product.use-case.js";
import { ListProductsUseCase } from "../../application/use-cases/list-products.use-case.js";
import { GetProductUseCase } from "../../application/use-cases/get-product.use-case.js";
import { PaginatedProductsResponseDto, ProductResponseDto } from "./dto/product.response.dto.js";
import { CreateProductRequestDto } from "./dto/create-product.request.dto.js";
import { ListProductsQueryDto } from "./dto/list-products.query.dto.js";

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly createProduct: CreateProductUseCase,
        private readonly getProduct: GetProductUseCase,
        private readonly listProducts: ListProductsUseCase,
    ) { }

    @Post()
    @ApiCreatedResponse({ type: ProductResponseDto })
    async create(@Body() dto: CreateProductRequestDto): Promise<ProductResponseDto> {
        const product = await this.createProduct.execute({
            name: dto.name,
            description: dto.description,
            priceCents: dto.priceCents,
            stock: dto.stock,
        });

        return ProductResponseDto.from(product);
    }

    @Get()
    @ApiOkResponse({ type: PaginatedProductsResponseDto })
    async findAll(@Query() query: ListProductsQueryDto): Promise<PaginatedProductsResponseDto> {
        const results = await this.listProducts.execute({
            page: query.page,
            limit: query.limit
        });

        return {
            ...results,
            items: results.items.map((product) => ProductResponseDto.from(product))
        }
    }

    @Get(':id')
    @ApiOkResponse({ type: ProductResponseDto })
    @ApiNotFoundResponse({ description: 'Product not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
        const product = await this.getProduct.execute(id);
        return ProductResponseDto.from(product);
    }
}