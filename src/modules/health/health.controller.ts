import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";
import { Public } from "../auth/presentation/http/decorators/public.decorator.js";

@ApiTags('health')
@Controller('health')
export class HealthController {
    constructor(
        private readonly dataSource: DataSource
    ) { }

    @Public()
    @Get()
    async check(): Promise<{ status: string }> {
        try {
            await this.dataSource.query('SELECT 1');
            return { status: 'Ok' };
        } catch {
            throw new ServiceUnavailableException('The database is not responding');
        }
    }
}