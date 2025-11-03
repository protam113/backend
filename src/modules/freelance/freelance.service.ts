import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FreelanceDocument, FreelanceEntity } from 'src/entities/freelance.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateFreelanceDto } from './dtos/create.dto';
import { UpdateFreelanceDto } from './dtos/update.dto';

@Injectable()
export class FreelanceService {
    constructor(
        @InjectModel(FreelanceEntity.name)
        private readonly freelanceModel: Model<FreelanceDocument>,

        @InjectModel(UserEntity.name)
        private readonly userModel: Model<UserEntity>,
    ) { }

    async createForUser(userId: string, dto?: CreateFreelanceDto): Promise<FreelanceEntity> {
        const exists = await this.freelanceModel.findOne({ userId });
        if (exists) return exists;

        const profile = new this.freelanceModel({
            userId,
            skills: dto?.skills || [],
            portfolioLinks: dto?.portfolioLinks || [],
            hourlyRate: dto?.hourlyRate || 0,
            experienceLevel: dto?.experienceLevel || 'Junior',
        });
        return profile.save();
    }

    async getByUserId(userId: string): Promise<FreelanceEntity> {
        const profile = await this.freelanceModel.findOne({ userId });
        if (!profile) throw new NotFoundException('Freelance profile not found');
        return profile;
    }

    async updateProfile(userId: string, dto: UpdateFreelanceDto): Promise<FreelanceEntity> {
        const profile = await this.freelanceModel.findOne({ userId });
        if (!profile) throw new NotFoundException('Freelance profile not found');

        Object.assign(profile, dto);
        return profile.save();
    }

    async deleteProfile(userId: string): Promise<void> {
        await this.freelanceModel.deleteOne({ userId });
    }
}
