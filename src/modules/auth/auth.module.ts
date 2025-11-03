import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthPublicController } from './auth.public.controller';
import { UserEntity, UserSchema } from '../../entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guards/RolesGuard';
import { FreelanceEntity, FreelanceSchema } from 'src/entities/freelance.entity';
import { ClientEntity, ClientSchema } from 'src/entities/client.entity';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserSchema },
      { name: FreelanceEntity.name, schema: FreelanceSchema },
      { name: ClientEntity.name, schema: ClientSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'defaultSecretKey'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, RolesGuard, AuthService],
  exports: [RolesGuard, JwtModule],
  controllers: [AuthPublicController],
})
export class AuthModule { }
