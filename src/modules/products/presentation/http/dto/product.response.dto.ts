import { ApiProperty } from '@nestjs/swagger';
import { ProductPrimitives } from '../../../domain/entities/product.entity.js';

export class ProductResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({ type: String, nullable: true })
    description!: string | null;

    @ApiProperty({ description: 'Price in cents' })
    priceCents!: number;

    @ApiProperty()
    stock!: number;

    @ApiProperty()
    isActive!: boolean;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    static from(product: ProductPrimitives): ProductResponseDto {
        return Object.assign(new ProductResponseDto(), product);
    }
}

export class PaginatedProductsResponseDto {
    @ApiProperty({ type: [ProductResponseDto] })
    items!: ProductResponseDto[];

    @ApiProperty()
    total!: number;

    @ApiProperty()
    page!: number;

    @ApiProperty()
    limit!: number;
}