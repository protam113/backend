import { Base } from './base.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { COLLECTION_KEYS } from 'src/database/collections';
import { UserEntity } from './user.entity';
import { Exp } from 'src/common/enums/exp.enum';

@Schema()
export class FreelanceEntity extends Base {
    @Prop({ type: [String], default: [] })
    skills: string[];

    @Prop({ type: [String], default: [] })
    portfolioLinks: string[];

    @Prop({ required: true })
    hourlyRate: number;

    @Prop({ enum: Exp, default: Exp.Junior })
    experienceLevel: Exp;

    @Prop({ type: String, ref: UserEntity.name })
    userId: string;

}
export type FreelanceDocument = FreelanceEntity & Document;
export const FreelanceSchema = SchemaFactory.createForClass(FreelanceEntity);
FreelanceSchema.set('collection', COLLECTION_KEYS.FREELANCE);
