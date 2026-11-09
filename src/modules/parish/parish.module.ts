import { Module } from '@nestjs/common';
import { ParishService } from './parish.service';
import { ParishController } from './parish.controller';

@Module({
  providers: [ParishService],
  controllers: [ParishController]
})
export class ParishModule {}
