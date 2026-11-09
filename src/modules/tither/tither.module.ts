import { Module } from '@nestjs/common';
import { TitherService } from './tither.service';
import { TitherController } from './tither.controller';

@Module({
  providers: [TitherService],
  controllers: [TitherController]
})
export class TitherModule {}
