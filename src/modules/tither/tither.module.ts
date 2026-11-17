import { Module } from '@nestjs/common';
import { TitherController } from './tither.controller';
import { TitherService } from './tither.service';

@Module({
  controllers: [TitherController],
  providers: [TitherService],
  exports: [TitherService],
})
export class TitherModule {}