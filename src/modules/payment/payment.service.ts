import { InjectModel } from '@nestjs/mongoose';
import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { PaymentDocument, PaymentEntity } from '../../entities/payment.entity';
import { ProjectDocument, ProjectEntity } from '../../entities/project.entity';
import { UserData } from '../user/user.interface';
import { ProposalStatus } from 'src/common/enums/proposal.enum';
import { Role } from 'src/common/enums/role.enum';
import { Pagination } from '../paginate/pagination';
import { PaginationOptionsInterface } from '../paginate/pagination.options.interface';
import { RedisCacheService } from '../cache/redis-cache.service';
import { CreatePaymentDto } from './dtos/create.dto';
import { UpdatePaymentStatusDto } from './dtos/update.dto';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);

    constructor(
        @InjectModel(PaymentEntity.name)
        private readonly paymentModel: Model<PaymentDocument>,
        @InjectModel(ProjectEntity.name)
        private readonly projectModel: Model<ProjectDocument>,
        private readonly redisCacheService: RedisCacheService,
    ) { }

    async createPayment(dto: CreatePaymentDto, user: UserData) {
        const project = await this.projectModel.findById(dto.projectId);
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (project.clientId !== user._id) {
            throw new ForbiddenException('You are not the client of this project');
        }

        const payment = new this.paymentModel({
            projectId: dto.projectId,
            freelancerId: project.freelancerId,
            paddleTransactionId: null,
            status: ProposalStatus.Pending,
            coverLetter: dto.description || '',
        });

        await payment.save();
        await this.redisCacheService.delByPattern(`payments_*`);

        this.logger.log(`Payment created: ${payment._id}`);
        return {
            status: 201,
            result: payment,
        };
    }

    async getPaymentsByProject(projectId: string, user: UserData) {
        const project = await this.projectModel.findById(projectId);
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (
            project.clientId !== user._id &&
            project.freelancerId !== user._id
        ) {
            throw new ForbiddenException('Access denied');
        }

        const payments = await this.paymentModel
            .find({ projectId })
            .sort({ createdAt: -1 })
            .lean();

        return {
            status: 200,
            results: payments,
        };
    }

    // Lấy payment detail
    async getPaymentById(id: string, user: UserData) {
        const payment = await this.paymentModel.findById(id).lean();
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Check permission
        const project = await this.projectModel.findById(payment.projectId);
        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (
            project.clientId !== user._id &&
            project.freelancerId !== user._id
        ) {
            throw new ForbiddenException('Access denied');
        }

        return {
            status: 200,
            result: payment,
        };
    }

    // Lấy tất cả payments của user
    async getMyPayments(
        user: UserData,
        options: PaginationOptionsInterface,
        status?: string,
    ) {
        const filter: any = {};

        if (user.role === Role.Client) {
            const projects = await this.projectModel
                .find({ clientId: user._id })
                .select('_id');
            filter.projectId = { $in: projects.map((p) => p._id) };
        } else if (user.role === Role.Freelancer) {
            filter.freelancerId = user._id;
        }

        if (status) {
            filter.status = status;
        }

        const payments = await this.paymentModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((options.page - 1) * options.limit)
            .limit(options.limit)
            .lean();

        const total = await this.paymentModel.countDocuments(filter);

        return new Pagination({
            results: payments,
            total,
            total_page: Math.ceil(total / options.limit),
            page_size: options.limit,
            current_page: options.page,
        });
    }

    // Update payment status
    async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto) {
        const payment = await this.paymentModel.findById(id);
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        payment.status = dto.status as ProposalStatus;
        if (dto.paddleTransactionId) {
            payment.paddleTransactionId = dto.paddleTransactionId;
        }

        await payment.save();
        await this.redisCacheService.delByPattern(`payments_*`);

        this.logger.log(`Payment ${id} status updated to ${dto.status}`);
        return {
            status: 200,
            result: payment,
        };
    }

    // Handle Paddle webhook
    async handlePaddleWebhook(webhookData: any) {
        try {
            const { event_type, data } = webhookData;
            this.logger.log(`Paddle webhook received: ${event_type}`);

            if (event_type === 'transaction.completed') {
                const transactionId = data.id;
                const customData = data.custom_data;

                const payment = await this.paymentModel.findById(customData.paymentId);
                if (payment) {
                    payment.status = ProposalStatus.Accepted;
                    payment.paddleTransactionId = transactionId;
                    await payment.save();
                    this.logger.log(`Payment ${payment._id} marked as completed`);
                }
            }

            if (event_type === 'transaction.payment_failed') {
                const customData = data.custom_data;
                const payment = await this.paymentModel.findById(customData.paymentId);
                if (payment) {
                    payment.status = ProposalStatus.Rejected;
                    await payment.save();
                    this.logger.log(`Payment ${payment._id} marked as failed`);
                }
            }

            return { received: true };
        } catch (error) {
            this.logger.error('Webhook processing error:', error);
            throw error;
        }
    }

    // Tạo Paddle checkout
    async createPaddleCheckout(
        projectId: string,
        amount: number,
        currency: string,
        user: UserData,
    ) {
        const checkoutUrl = `https://sandbox-checkout.paddle.com/checkout?project=${projectId}&amount=${amount}&currency=${currency}`;

        this.logger.log(`Created Paddle checkout: ${checkoutUrl}`);

        return {
            status: 200,
            checkoutUrl,
            message: 'Redirect user to this URL to complete payment',
        };
    }
}