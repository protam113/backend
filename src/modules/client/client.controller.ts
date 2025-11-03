import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/RolesGuard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateClientDto } from './dtos/update.dto';


@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Client)
    @Get('me')
    getMe(@Req() req) {
        return this.clientService.getByUserId(req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Client) @Patch('me')
    updateMe(@Req() req, @Body() dto: UpdateClientDto) {
        return this.clientService.updateProfile(req.user.id, dto);
    }
}
