import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ProposalStatus } from 'src/common/enums/proposal.enum';

export class UpdatePaymentStatusDto {
    @IsNotEmpty()
    @IsEnum(ProposalStatus)
    status: ProposalStatus;

    @IsOptional()
    @IsString()
    paddleTransactionId?: string;
}

