import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Logger,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { ProjectStatus } from './project.constant';
import { CreateProjectDto } from './dto/create_project.dto';
import { ProjectService } from './project.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../auth/guards/RolesGuard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller({ path: 'project', version: '1' })
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(
    private readonly projectService: ProjectService,
  ) { }

  @Get()
  async getProject(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: ProjectStatus,
    @Query('service') service?: string,
  ) {

    return this.projectService.findAll(
      { page, limit },
      startDate,
      endDate,
      status as ProjectStatus,
      service,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Client)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req,
  ) {
    const project = await this.projectService.create(
      createProjectDto,
      req.user,
    );

    return project;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Client)
  async delete(@Param('id') id: string, @Req() req) {
    await this.projectService.delete(id);
    return { message: 'Service deleted successfully' };
  }

  @Get(':id')
  async getServiceBySlug(@Param('id') id: string) {
    return this.projectService.findById(id);
  }

}
