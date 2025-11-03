import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Pagination } from '../paginate/pagination';
import { PaginationOptionsInterface } from '../paginate/pagination.options.interface';
import { UserData } from '../user/user.interface';
import { CreateProjectDto } from './dto/create_project.dto';
import {
  Error,
  Message,
  PROJECT_CACHE_TTL,
  ProjectStatus,
} from './project.constant';
import { RedisCacheService } from '../cache/redis-cache.service';
import { buildCacheKey } from '../../utils/cache-key.util';
import { ProjectDocument, ProjectEntity } from '../../entities/project.entity';
import { toDataResponse } from './project.mapper';
import { CreateProjectResponse } from './responses/create_project.response'
import { buildFilter } from 'src/helpers/helper';
@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(ProjectEntity.name)
    private readonly projectModel: Model<ProjectDocument>,
    private readonly redisCacheService: RedisCacheService
  ) { }



  async findAll(
    options: PaginationOptionsInterface,
    startDate?: string,
    endDate?: string,
    status?: ProjectStatus,
    service?: string,
  ): Promise<Pagination<any>> {
    const cacheKey = buildCacheKey('projects', {
      page: options.page,
      limit: options.limit,
      start: startDate,
      end: endDate,
    });
    const cached =
      await this.redisCacheService.get<Pagination<any>>(cacheKey);

    if (cached) {
      this.logger.log(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    const filter = buildFilter({ startDate, endDate });

    const projects = await this.projectModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .lean();

    const total = await this.projectModel.countDocuments(filter);

    const results = projects.map(toDataResponse);

    const result = new Pagination<any>({
      results,
      total,
      total_page: Math.ceil(total / options.limit),
      page_size: options.limit,
      current_page: options.page,
    });

    await this.redisCacheService.set(
      cacheKey,
      result,
      PROJECT_CACHE_TTL.PROJECT_LIST,
    );
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await this.projectModel.findByIdAndDelete(id);

    if (result) {
      await this.redisCacheService.delByPattern('projects*');
      await this.redisCacheService.del(`project_${id}`);
    } else {
      // If the blog wasn't found, throw a clear error
      throw new BadRequestException({

      });
    }
  }

  async create(
    createProjectDto: CreateProjectDto,
    user: UserData,
  ): Promise<CreateProjectResponse> {
    const {
      title,
      content,
      description,
      link,
      brand_name,
      testimonial,
      service,
      client,
    } = createProjectDto;

    if (!service) {
      throw new BadRequestException({
        message: Message.SERVICE_REQUIRED,
        code: Error.SERVICE_REQUIRED,
      });
    }

    // Generate slug from title
    if (!title || title.trim() === '') {
      throw new BadRequestException({
        message: Message.TitleIsRequired,
        error: Error.TITLE_REQUIRED,
      });
    }






    const newProject = new this.projectModel({
      title,
      content,
      description,
      brand_name,
      testimonial,
      client,
      link: link || undefined,
      status: ProjectStatus.Draft,
      user: {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
    });

    await this.redisCacheService.delByPattern('projects*');

    await newProject.save();

    return {
      status: "201",
      result: newProject,
    };
  }

  async findById(id: string): Promise<any> {
    const cacheKey = `project_${id}`;
    const cached = await this.redisCacheService.get<any>(cacheKey);

    if (cached) {
      this.logger.log(`Cache HIT: ${cacheKey}`);
      return cached;
    }
    const project = await this.projectModel
      .findOne({ id })
      .exec();

    if (!project) {
      throw new BadRequestException({
        statusCode: 400,
        message: Message.NotFound,
        error: Error.NOT_FOUND,
      });
    }
    const result = toDataResponse(project);

    await this.redisCacheService
      .set(cacheKey, result, 3600)
      .catch((err) => this.logger.error(`Failed to cache ${cacheKey}`, err));

    return result;
  }

  async validateProject(serviceId: string): Promise<boolean> {
    try {
      const service = await this.projectModel.findById(serviceId).exec();
      return !!service;
    } catch (error) {
      this.logger.error(`Error validating service: ${error.message}`);
      return false;
    }
  }


}
