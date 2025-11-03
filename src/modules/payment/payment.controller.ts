import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
    Logger,
    Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/RolesGuard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create.dto';
import { UpdatePaymentStatusDto } from './dtos/update.dto';

@Controller({ path: 'payment', version: '1' })
export class PaymentController {
    private readonly logger = new Logger(PaymentController.name);

    constructor(private readonly paymentService: PaymentService) { }

    // Tạo payment mới (Client tạo)
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Client)
    async createPayment(
        @Body() createPaymentDto: CreatePaymentDto,
        @Req() req,
    ) {
        this.logger.log(`Creating payment for project: ${createPaymentDto.projectId}`);
        return this.paymentService.createPayment(createPaymentDto, req.user);
    }

    // Lấy tất cả payments theo project
    @Get('project/:projectId')
    @UseGuards(JwtAuthGuard)
    async getPaymentsByProject(
        @Param('projectId') projectId: string,
        @Req() req,
    ) {
        return this.paymentService.getPaymentsByProject(projectId, req.user);
    }

    // Lấy payment detail
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getPaymentById(@Param('id') id: string, @Req() req) {
        return this.paymentService.getPaymentById(id, req.user);
    }

    // Lấy tất cả payments của user (role-based)
    @Get()
    @UseGuards(JwtAuthGuard)
    async getMyPayments(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('status') status?: string,
        @Req() req?,
    ) {
        return this.paymentService.getMyPayments(
            req.user,
            { page, limit },
            status,
        );
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Client)
    async updatePaymentStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdatePaymentStatusDto,
    ) {
        return this.paymentService.updatePaymentStatus(id, updateStatusDto);
    }

    @Post('webhook/paddle')
    async handlePaddleWebhook(@Body() webhookData: any) {
        this.logger.log('Received Paddle webhook');
        return this.paymentService.handlePaddleWebhook(webhookData);
    }

    @Post('checkout/create')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Client)
    async createCheckout(
        @Body() body: { projectId: string; amount: number; currency: string },
        @Req() req,
    ) {
        return this.paymentService.createPaddleCheckout(
            body.projectId,
            body.amount,
            body.currency,
            req.user,
        );
    }
}