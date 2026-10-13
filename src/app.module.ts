import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation.js';
import { DatabaseModule } from './shared/infrastructure/database/database.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { ProductModule } from './modules/products/products.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

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
    ProductModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
