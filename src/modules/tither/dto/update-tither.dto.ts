import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateTitherDto } from './create-tither.dto';

export class UpdateTitherDto extends PartialType(
  OmitType(CreateTitherDto, ['password'] as const),
) {}