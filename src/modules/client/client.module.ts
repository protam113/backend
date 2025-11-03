import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisCacheModule } from '../cache/redis-cache.module';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientEntity, ClientSchema } from 'src/entities/client.entity';
import { UserEntity, UserSchema } from 'src/entities/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ClientEntity.name, schema: ClientSchema },
            { name: UserEntity.name, schema: UserSchema }
        ]),
        RedisCacheModule,
        AuthModule,
        UserModule,
    ],
    controllers: [ClientController],
    providers: [ClientService],
    exports: [ClientService],
})
export class ClientModule { }

