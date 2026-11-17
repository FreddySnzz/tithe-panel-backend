import { 
  Body, 
  Controller, 
  Get, 
  ParseIntPipe, 
  Patch, 
  Post, 
  Query, 
  Req, 
  UseGuards
} from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnsService } from './return.service';
import { UpdateReturnDto } from './dto/update-return.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('returns')
@UseGuards(RolesGuard)
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Get('my-calendar')
  async getMyCalendar(
    @Req() req: any,
    @Query('year', ParseIntPipe) year: number
  ): Promise<any> {
    return this.returnsService.getMyAnnualCalendar(req.user.sub, year);
  }

  @Post('checkout')
  async checkout(
    @Req() req: any,
    @Body() dto: CreateReturnDto
  ): Promise<any> {
    return this.returnsService.processReturn(
      req.user.sub, 
      req.user.parishId, 
      dto
    );
  }

  @Get('report')
  async getReport(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('parishId') parishId?: string
  ): Promise<any> {
    return this.returnsService.getParishReport(year, month, parishId);
  }

  @Patch('update-status')
  @Roles(Role.SUPER_ADMIN, Role.PARISH_ADMIN)
  async updateReturnStatus(
    @Body() dto: UpdateReturnDto
  ): Promise<any> {
    return this.returnsService.updateReturnStatus(dto.status, dto.returnId);
  }
}