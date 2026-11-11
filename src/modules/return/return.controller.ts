import { 
  Body, 
  Controller, 
  Get, 
  ParseIntPipe, 
  Post, 
  Query, 
  Req 
} from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnsService } from './return.service';

@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Get('my-calendar')
  getMyCalendar(
    @Req() req: any,
    @Query('year', ParseIntPipe) year: number
  ) {
    return this.returnsService.getMyAnnualCalendar(req.user.sub, year);
  }

  @Post('checkout')
  checkout(
    @Req() req: any,
    @Body() dto: CreateReturnDto
  ) {
    return this.returnsService.processReturn(
      req.user.sub, 
      req.user.parishId, 
      dto
    );
  }

  @Get('report')
  getReport(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('parishId', ParseIntPipe) parishId?: number
  ) {
    return this.returnsService.getParishReport(year, month, parishId);
  }
}