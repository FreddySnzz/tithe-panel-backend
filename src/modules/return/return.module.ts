import { Module } from '@nestjs/common';
import { ReturnsService } from './return.service';
import { ReturnsController } from './return.controller';

@Module({
  providers: [ReturnsService],
  controllers: [ReturnsController]
})
export class ReturnModule {}
