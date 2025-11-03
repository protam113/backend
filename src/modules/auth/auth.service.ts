import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { UserEntity, UserDocument } from '../../entities/user.entity';

import { LogInDTO } from './dtos/log-in.dto';
import { LogInResponse } from './responses/log-in.response';
import { AuthError, AuthSuccess } from './auth.constant';
import { Role } from '../../common/enums/role.enum';
import { RegisterUserDto } from './dtos/register.dto';
import { FreelanceDocument, FreelanceEntity } from 'src/entities/freelance.entity';
import { ClientDocument, ClientEntity } from 'src/entities/client.entity';
import { FreelanceService } from '../freelance/freelance.service';
import { ClientService } from '../client/client.service';

@Injectable()

export class AuthService implements OnModuleInit {


  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(FreelanceEntity.name)
    private readonly freelanceModel: Model<FreelanceDocument>,

    @InjectModel(ClientEntity.name)
    private readonly clientModel: Model<ClientDocument>,

    private readonly configService: ConfigService,
  ) { }

  async onModuleInit() {
    await this.createAdminAccount();
  }

  private async createAdminAccount() {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminName = this.configService.get<string>('ADMIN_NAME');

    // Kiểm tra biến môi trường
    if (!adminUsername || !adminPassword || !adminEmail) {
      Logger.warn('Admin credentials not configured in environment variables');
      return;
    }

    try {
      const existingAdmin = await this.userModel.findOne({
        username: adminUsername,
      });

      if (existingAdmin) {
        Logger.log(`Admin account already exists: ${adminUsername}`);
        return;
      }

      const admin = new this.userModel({
        username: adminUsername,
        password: adminPassword,
        email: adminEmail,
        fullName: adminName || 'Administrator',
        role: Role.Admin,
        isActive: true,
      });

      await admin.save();
      Logger.log(`✅ Admin account created successfully: ${adminUsername}`);
    } catch (error) {
      Logger.error('Failed to create admin account:', error);
      throw error;
    }
  }

  async validateAttemptAndSignToken(dto: LogInDTO): Promise<LogInResponse> {
    if (!dto.password || typeof dto.password !== 'string') {
      throw new BadRequestException(AuthError.PasswordRequired);
    }

    const user = await this.userModel
      .findOne({ username: dto.username })
      .select('+password')
      .exec();

    if (!user || !user.password) {
      throw new BadRequestException(AuthError.InvalidLoginCredentials);
    }

    if (!user.username) {
      throw new InternalServerErrorException('Username is missing');
    }

    const isValidPassword = await user.comparePassword(dto.password);

    if (!isValidPassword) {
      throw new BadRequestException(AuthError.InvalidLoginCredentials);
    }

    if (![Role.Admin, Role.Client, Role.Freelancer].includes(user.role)) {
      throw new BadRequestException(AuthError.AccessDenied);
    }

    return {
      status: 'success',
      message: AuthSuccess.LoginSuccess,
      userInfo: {
        _id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
    };
  }

  async validateUserAndGetRole(_id: string): Promise<string> {
    const user = await this.userModel.findById(_id);
    if (!user?.role) {
      throw new BadRequestException(AuthError.UserRole);
    }
    return user.role;
  }


  async registerUser(dto: RegisterUserDto) {
    const { username, email, password, fullname, role } = dto;

    const newUser = await this.userModel.create({
      username,
      email,
      password,
      fullName: fullname,
      role,
      isActive: true,
    });

    if (role === 'freelancer') {
      await this.freelanceModel.create({
        userId: newUser._id,
      });
    } else if (role === 'client') {
      await this.clientModel.create({
        userId: newUser._id,
        companyName: '',
        industry: '',
        website: '',
      });
    }

    return {
      user: {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }

}
