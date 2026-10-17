import { ApiProperty } from '@nestjs/swagger';
import { ORDER_STATUSES, type OrderPrimitives, type OrderStatus } from '../../../domain/entities/order.entity.js';

export class OrderItemResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    productId!: string;

    @ApiProperty()
    quantity!: number;

    @ApiProperty({ description: 'Unit price in cents at the time of purchase' })
    unitPriceCents!: number;
}

export class OrderResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    userId!: string;

    @ApiProperty({ enum: ORDER_STATUSES })
    status!: OrderStatus;

    @ApiProperty({ description: 'Total in cents' })
    totalCents!: number;

    @ApiProperty({ type: [OrderItemResponseDto] })
    items!: OrderItemResponseDto[];

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    static from(order: OrderPrimitives): OrderResponseDto {
        return Object.assign(new OrderResponseDto(), order);
    }
}

export class PaginatedOrdersResponseDto {
    @ApiProperty({ type: [OrderResponseDto] })
    items!: OrderResponseDto[];

    @ApiProperty()
    total!: number;

    @ApiProperty()
    page!: number;

    @ApiProperty()
    limit!: number;
}