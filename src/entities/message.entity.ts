import { Base } from './base.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COLLECTION_KEYS } from 'src/database/collections';
import { UserEntity } from './user.entity';
import { ProjectEntity } from './project.entity';

@Schema()
export class MessageEntity extends Base {
    @Prop()
    content: string;

    @Prop({ type: String, ref: ProjectEntity.name })
    projectId: string;

    @Prop({ type: String, ref: UserEntity.name })
    senderId: string;

    @Prop({ type: String, ref: UserEntity.name })
    receiverId: string;
}
export type MessageDocument = MessageEntity & Document;
export const MessageSchema = SchemaFactory.createForClass(MessageEntity);
MessageSchema.set('collection', COLLECTION_KEYS.MESSAGE);
