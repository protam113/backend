import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsString()
    projectId: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    amount?: number;

    @IsOptional()
    @IsString()
    currency?: string;
}