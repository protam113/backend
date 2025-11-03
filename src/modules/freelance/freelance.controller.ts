import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { FreelanceService } from './freelance.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { UpdateFreelanceDto } from './dtos/update.dto';

@Controller('freelancer')
export class FreelanceController {
    constructor(private readonly freelanceService: FreelanceService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req) {
        return this.freelanceService.getByUserId(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    updateMe(@Req() req, @Body() dto: UpdateFreelanceDto) {
        return this.freelanceService.updateProfile(req.user.id, dto);
    }
}
