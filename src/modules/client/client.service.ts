import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientEntity, ClientDocument } from 'src/entities/client.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateClientDto } from './dtos/create.dto';
import { UpdateClientDto } from './dtos/update.dto';

@Injectable()
export class ClientService {
    constructor(
        @InjectModel(ClientEntity.name)
        private readonly clientModel: Model<ClientDocument>,

        @InjectModel(UserEntity.name)
        private readonly userModel: Model<UserEntity>,
    ) { }

    async createForUser(userId: string, dto: CreateClientDto): Promise<ClientEntity> {
        const exists = await this.clientModel.findOne({ userId });
        if (exists) return exists;

        const client = new this.clientModel({
            userId,
            companyName: dto.companyName,
            industry: dto.industry,
            website: dto.website,
        });
        return client.save();
    }

    async getByUserId(userId: string): Promise<ClientEntity> {
        const client = await this.clientModel.findOne({ userId });
        if (!client) throw new NotFoundException('Client profile not found');
        return client;
    }

    async updateProfile(userId: string, dto: UpdateClientDto): Promise<ClientEntity> {
        const client = await this.clientModel.findOne({ userId });
        if (!client) throw new NotFoundException('Client profile not found');

        Object.assign(client, dto);
        return client.save();
    }

}
