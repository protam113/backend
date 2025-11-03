import { CacheModule } from '@nestjs/cache-manager';
import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppBaseController } from './app.base.controller';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
import { AppService } from './app.service';
import { RedisCacheModule } from 'src/modules/cache/redis-cache.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { CorsMiddleware } from 'src/middlewares/cors.middleware';
import { RateLimitMiddleware } from 'src/middlewares/rate-limiter.middleware';
import { JwtCookieMiddleware } from 'src/middlewares/jwt-cookie.middleware';
import { RolesGuard } from 'src/modules/auth/guards/RolesGuard';
import { ProjectModule } from 'src/modules/project/project.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { FreelanceModule } from 'src/modules/freelance/freelance.module';
import { ClientModule } from 'src/modules/client/client.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await import('cache-manager-ioredis'),
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
        db: configService.get('REDIS_INDEX'),
        ttl: 60,
      }),
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    RedisCacheModule,

    AuthModule,
    UserModule,
    ProjectModule,
    PaymentModule,
    FreelanceModule,
    ClientModule
  ],
  controllers: [AppBaseController],
  providers: [
    {
      provide: 'app',
      useClass: AppService,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {

    consumer.apply(CorsMiddleware).forRoutes('*');


    consumer.apply(RateLimitMiddleware).forRoutes('*');

    consumer
      .apply(JwtCookieMiddleware)
      .exclude(
        '/v1/public/auth/login',
        '/v1/public/auth/sign-up',
      )
      .forRoutes('*');
  }
}
