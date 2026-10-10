import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation.js';
import { DatabaseModule } from './shared/infrastructure/database/database.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { ProductModule } from './modules/products/products.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        libraryOptions: {
          abortEarly: false
        },
      },
    }),
    DatabaseModule,
    HealthModule,
    ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
