import { CivilStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTitherDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone principal é obrigatório.' })
  phone!: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  birthDate!: string;

  @IsString()
  @IsOptional()
  phoneSecondary?: string;

  @IsEnum(CivilStatus)
  @IsNotEmpty({ message: 'O estado civil é obrigatório.' })
  civilStatus!: CivilStatus;

  @IsString()
  @IsOptional()
  spouseName?: string;

  @IsDateString()
  @IsOptional()
  marriageDate?: string;

  @IsString()
  @IsOptional()
  ministry?: string;

  @IsString()
  @IsOptional()
  community?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  neighborhood?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;
}