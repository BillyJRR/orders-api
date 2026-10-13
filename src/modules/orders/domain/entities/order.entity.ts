import { randomUUID } from "node:crypto";
import { InvalidOrderError } from "../errors/invalid-order.error.js";
import { InvalidOrderStatusTransitionError } from "../errors/invalid-order-status-transition.error.js";

export const ORDER_STATUSES = ['PENDING', 'PAID', 'CANCELLED', 'EXPIRED'] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
    PENDING: ['PAID', 'CANCELLED', 'EXPIRED'],
    PAID: ['CANCELLED'],
    CANCELLED: [],
    EXPIRED: [],
};

const MAX_TOTAL_CENTS = 2_147_483_647;

export interface OrderItemPrimitives {
    id: string;
    productId: string;
    quantity: number;
    unitPriceCents: number;
}

export interface OrderPrimitives {
    id: string;
    userId: string;
    status: OrderStatus;
    totalCents: number;
    items: OrderItemPrimitives[];
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderLineInput {
    productId: string;
    quantity: number;
    unitPriceCents: number;
}

export interface CreateOrderProps {
    userId: string;
    lines: OrderLineInput[];
}

export class Order {
    constructor(
        private readonly props: OrderPrimitives
    ) { }

    static create(input: CreateOrderProps): Order {
        if (input.lines.length === 0) {
            throw new InvalidOrderError('The order must contain at least one product');
        }

        const seenProducts = new Set<string>();
        let totalCents = 0;
        const items = input.lines.map((line) => {
            if (!Number.isInteger(line.quantity) || line.quantity <= 0) {
                throw new InvalidOrderError('The quantity must be an integer greater than 0');
            }

            if (seenProducts.has(line.productId)) {
                throw new InvalidOrderError('A product cannot be repeated in the same order');
            }

            seenProducts.add(line.productId);
            totalCents += line.quantity * line.unitPriceCents;

            return {
                id: randomUUID(),
                productId: line.productId,
                quantity: line.quantity,
                unitPriceCents: line.unitPriceCents,
            };
        });

        if (totalCents > MAX_TOTAL_CENTS) {
            throw new InvalidOrderError('The order total exceeds the maximum allowed');
        }

        const now = new Date();

        return new Order({
            id: randomUUID(),
            userId: input.userId,
            status: 'PENDING',
            totalCents,
            items,
            createdAt: now,
            updatedAt: now,
        });
    }

    static restore(props: OrderPrimitives): Order {
        return new Order({ ...props, items: props.items.map((item) => ({ ...item })) });
    }

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get status(): OrderStatus {
        return this.props.status;
    }

    get totalCents(): number {
        return this.props.totalCents;
    }

    pay(): void {
        this.transitionTo('PAID');
    }

    cancel(): void {
        this.transitionTo('CANCELLED');
    }

    expire(): void {
        this.transitionTo('EXPIRED');
    }

    toPrimitives(): OrderPrimitives {
        return { ...this.props, items: this.props.items.map((item) => ({ ...item })) };
    }

    private transitionTo(next: OrderStatus): void {
        if (!ALLOWED_TRANSITIONS[this.props.status].includes(next)) {
            throw new InvalidOrderStatusTransitionError(this.props.status, next);
        }

        this.props.status = next;
        this.props.updatedAt = new Date();
    }
}