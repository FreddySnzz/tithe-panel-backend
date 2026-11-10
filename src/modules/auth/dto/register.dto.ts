import { CivilStatus } from '@prisma/client';
import { 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsUUID, 
  Length, 
  IsDateString 
} from 'class-validator';

export class RegisterDto {
  // User =====
  @IsString()
  @IsNotEmpty({ message: 'O telefone de acesso é obrigatório' })
  phone!: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Length(6, 100, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password!: string;

  @IsUUID(4, { message: 'O ID da paróquia deve ser um UUID válido' })
  @IsNotEmpty({ message: 'A paróquia é obrigatória' })
  parishId!: string;

  // Tither =====
  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  name!: string;

  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida' })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  birthDate!: string;

  @IsEnum(CivilStatus, { message: 'Estado civil inválido' })
  @IsNotEmpty({ message: 'O estado civil é obrigatório' })
  civilStatus!: CivilStatus;

  @IsOptional()
  @IsString()
  phoneSecondary?: string;

  @IsOptional()
  @IsString()
  ministry?: string; // "Participa de alguma pastoral?"

  @IsOptional()
  @IsString()
  spouseName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'A data de casamento deve ser uma data válida' })
  marriageDate?: string;

  @IsOptional()
  @IsString()
  community?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}