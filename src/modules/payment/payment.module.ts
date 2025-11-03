import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentEntity, PaymentSchema } from '../../entities/payment.entity';
import { ProjectEntity, ProjectSchema } from '../../entities/project.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RedisCacheModule } from '../cache/redis-cache.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PaymentEntity.name, schema: PaymentSchema },
            { name: ProjectEntity.name, schema: ProjectSchema },
        ]),
        RedisCacheModule,
        AuthModule,
        ProjectModule
    ],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule { }