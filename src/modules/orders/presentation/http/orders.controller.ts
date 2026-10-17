import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../../shared/presentation/http/dto/pagination.query.dto.js';
import type { AuthenticatedUser } from '../../../auth/application/ports/token.service.js';
import { CurrentUser } from '../../../auth/presentation/http/decorators/current-user.decorator.js';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case.js';
import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case.js';
import { ListMyOrdersUseCase } from '../../application/use-cases/list-my-orders.use-case.js';
import { CreateOrderRequestDto } from './dto/create-order.request.dto.js';
import { OrderResponseDto, PaginatedOrdersResponseDto } from './dto/order.response.dto.js';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly createOrder: CreateOrderUseCase,
        private readonly getOrder: GetOrderUseCase,
        private readonly listMyOrders: ListMyOrdersUseCase,
    ) { }

    @Post()
    @ApiCreatedResponse({ type: OrderResponseDto })
    @ApiConflictResponse({ description: 'Insufficient stock' })
    @ApiNotFoundResponse({ description: 'A product does not exist' })
    async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateOrderRequestDto): Promise<OrderResponseDto> {
        const order = await this.createOrder.execute({
            userId: user.id,
            items: dto.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        });
        return OrderResponseDto.from(order);
    }

    @Get()
    @ApiOkResponse({ type: PaginatedOrdersResponseDto })
    async findMine(@CurrentUser() user: AuthenticatedUser, @Query() query: PaginationQueryDto): Promise<PaginatedOrdersResponseDto> {
        const result = await this.listMyOrders.execute({
            userId: user.id,
            page: query.page,
            limit: query.limit,
        });
        return {
            ...result,
            items: result.items.map((order) => OrderResponseDto.from(order)),
        };
    }

    @Get(':id')
    @ApiOkResponse({ type: OrderResponseDto })
    @ApiNotFoundResponse({ description: 'Order not found' })
    async findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string): Promise<OrderResponseDto> {
        const order = await this.getOrder.execute({ orderId: id, requester: user });
        return OrderResponseDto.from(order);
    }
}