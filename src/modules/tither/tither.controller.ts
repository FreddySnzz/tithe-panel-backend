import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TitherService } from './tither.service';
import { CreateTitherDto } from './dto/create-tither.dto';
import { UpdateTitherDto } from './dto/update-tither.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('tither')
@UseGuards(RolesGuard)
export class TitherController {
  constructor(private readonly tithersService: TitherService) {}

  @Get('me')
  @Roles(Role.TITHER, Role.PARISH_ADMIN)
  getMyProfile(
    @Req() req: any
  ) {
    return this.tithersService.findByUserId(req.user.sub);
  }

  @Patch('me')
  @Roles(Role.TITHER, Role.PARISH_ADMIN)
  async updateMyProfile(
    @Req() req: any, 
    @Body() dto: UpdateTitherDto
  ) {
    const tither = await this.tithersService.findByUserId(req.user.sub);
    return this.tithersService.update(tither.id, dto);
  }

  @Post()
  @Roles(Role.PARISH_ADMIN)
  create(
    @Req() req: any, 
    @Body() dto: CreateTitherDto
  ) {
    return this.tithersService.createByAdmin(req.user.parishId, dto);
  }

  @Get()
  @Roles(Role.PARISH_ADMIN)
  findAll(
    @Query('search') search?: string
  ) {
    return this.tithersService.findAll(search);
  }

  @Get(':id')
  @Roles(Role.PARISH_ADMIN)
  findOne(
    @Param('id') id: string
  ) {
    return this.tithersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.PARISH_ADMIN)
  update(
    @Param('id') id: string, 
    @Body() dto: UpdateTitherDto
  ) {
    return this.tithersService.update(id, dto);
  }
}