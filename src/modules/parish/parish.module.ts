import { Module } from '@nestjs/common';
import { ParishesController } from './parish.controller';
import { ParishesService } from './parish.service';

@Module({
  controllers: [ParishesController],
  providers: [ParishesService],
  exports: [ParishesService],
})
export class ParishesModule {}