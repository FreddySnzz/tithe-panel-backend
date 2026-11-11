import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  UseGuards 
} from '@nestjs/common';
import { ParishesService } from './parish.service';
import { CreateParishDto } from './dto/create-parish.dto';
import { UpdateParishDto } from './dto/update-parish.dto';
import { Public } from '../auth/decorators/is-public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('parishes')
@UseGuards(RolesGuard)
export class ParishesController {
  constructor(private readonly parishesService: ParishesService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  create(@Body() dto: CreateParishDto) {
    return this.parishesService.create(dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
  findAll() {
    return this.parishesService.findAll();
  }

  @Public()
  @Get('slug/:slug')
  getWhitelabelConfig(@Param('slug') slug: string) {
    return this.parishesService.findBySlug(slug);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.PARISH_ADMIN)
  findOne(@Param('id') id: string) {
    return this.parishesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.PARISH_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateParishDto) {
    return this.parishesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.parishesService.remove(id);
  }
}