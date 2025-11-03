import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Logger,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Query,
  Delete,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';

import { UserService } from './user.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { UserResponse } from './user.interface';
import { RolesGuard } from '../auth/guards/RolesGuard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({ path: 'users', version: '1' })
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
  ) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req): Promise<UserResponse> {
    this.logger.debug('Getting info for current user:', req.user);
    const userId = req.user?.userId;

    if (!userId) {
      this.logger.error('User ID is missing in request');
      throw new BadRequestException('Invalid token: Missing user ID');
    }

    const user = await this.userService.findByUuid(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get('statistic')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUserStatistic() {
    return this.userService.getUserStatistic();
  }

  @Post('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Client)
  @UseInterceptors(FileInterceptor(''))
  async createManager(@Body() body: CreateManagerDto, @Req() req) {
    const manager = await this.userService.createManagerUser(body, req.user);


    return manager;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Client)
  async getUsers(
    @Query('role') role?: Role,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') searchQuery?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    this.logger.debug('Fetching users with filters:', {
      role,
      startDate,
      endDate,
      searchQuery,
      page,
      limit,
    });

    return this.userService.getAllUsers(
      role,
      startDate,
      endDate,
      searchQuery,
      page,
      limit,
    );
  }

  @Delete('manager/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Client)
  async deleteManager(@Param('id') userId: string) {
    this.logger.warn(`Deleting manager with ID: ${userId}`);
    const result = await this.userService.deleteManagerById(userId);
    return result;
  }
}
