import { Base } from './base.entity';
import { v4 as uuidv4 } from 'uuid';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COLLECTION_KEYS } from 'src/database/collections';
import { UserEntity } from './user.entity';
import { Status } from 'src/common/enums/staus.enum';

@Schema()
export class ProjectEntity extends Base {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  skillsRequired: string[];

  @Prop({ required: true })
  client: string;

  @Prop({ default: 0 })
  budgetMin: number;

  @Prop({ default: 0 })
  budgetMax: number;

  @Prop({ enum: Status, default: Status.Open })
  status: string;

  @Prop({ type: String, ref: UserEntity.name })
  clientId: string;

  @Prop({ type: String, ref: UserEntity.name })
  freelancerId: string;
}
export type ProjectDocument = ProjectEntity & Document;
export const ProjectSchema = SchemaFactory.createForClass(ProjectEntity);
ProjectSchema.set('collection', COLLECTION_KEYS.PROJECT);
