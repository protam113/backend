import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisCacheModule } from '../cache/redis-cache.module';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { FreelanceController } from './freelance.controller';
import { FreelanceService } from './freelance.service';
import { FreelanceEntity, FreelanceSchema } from 'src/entities/freelance.entity';
import { UserEntity, UserSchema } from 'src/entities/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FreelanceEntity.name, schema: FreelanceSchema },
            { name: UserEntity.name, schema: UserSchema }
        ]),
        RedisCacheModule,
        AuthModule,
        UserModule,
    ],
    controllers: [FreelanceController],
    providers: [FreelanceService],
    exports: [FreelanceService],
})
export class FreelanceModule { }

