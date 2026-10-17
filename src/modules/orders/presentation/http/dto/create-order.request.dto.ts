import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsUUID, Max, Min, ValidateNested } from 'class-validator';

export class CreateOrderItemRequestDto {
    @ApiProperty({ format: 'uuid', example: 'a1111111-1111-4111-8111-111111111111' })
    @IsUUID()
    productId!: string;

    @ApiProperty({ minimum: 1, maximum: 1000, example: 2 })
    @IsInt()
    @Min(1)
    @Max(1000)
    quantity!: number;
}

export class CreateOrderRequestDto {
    @ApiProperty({ type: [CreateOrderItemRequestDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemRequestDto)
    items!: CreateOrderItemRequestDto[];
}