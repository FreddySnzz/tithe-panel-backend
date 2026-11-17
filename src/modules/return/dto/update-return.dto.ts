import { ReturnStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class UpdateReturnDto {
  @IsEnum(ReturnStatus)
  status!: ReturnStatus

  @IsUUID()
  returnId!: string
}