import { Base } from './base.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { COLLECTION_KEYS } from 'src/database/collections';
import { UserEntity } from './user.entity';

@Schema()
export class ClientEntity extends Base {
    @Prop({ required: true })
    companyName: string;

    @Prop({ required: true })
    industry: string;

    @Prop({ required: true })
    website: string;

    @Prop({ type: String, ref: UserEntity.name })
    userId: string;
}
export type ClientDocument = ClientEntity & Document;
export const ClientSchema = SchemaFactory.createForClass(ClientEntity);
ClientSchema.set('collection', COLLECTION_KEYS.CLIENT);
