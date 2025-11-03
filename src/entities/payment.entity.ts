import { Base } from './base.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COLLECTION_KEYS } from 'src/database/collections';
import { UserEntity } from './user.entity';
import { ProjectEntity } from './project.entity';
import { ProposalStatus } from 'src/common/enums/proposal.enum';

@Schema()
export class PaymentEntity extends Base {
    @Prop()
    coverLetter: string;

    @Prop({ type: String })
    paddleTransactionId: string;

    @Prop({ enum: ProposalStatus, default: ProposalStatus.Pending })
    status: ProposalStatus;

    @Prop({ type: String, ref: ProjectEntity.name })
    projectId: string;

    @Prop({ type: String, ref: UserEntity.name })
    freelancerId: string;
}
export type PaymentDocument = PaymentEntity & Document;
export const PaymentSchema = SchemaFactory.createForClass(PaymentEntity);
PaymentSchema.set('collection', COLLECTION_KEYS.PAYMENT);
