import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateParishDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da paróquia é obrigatório.' })
  name!: string;

  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens.',
  })
  slug?: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone de contato é obrigatório.' })
  phone!: string;

  @IsString()
  @IsNotEmpty({ message: 'O documento de registro paroquial é obrigatório.' })
  document!: string;

  @IsString()
  @IsOptional()
  priest?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'A cor primária deve ser um código hex válido (ex: #FF5733).',
  })
  themePrimaryColor?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'A cor secundária deve ser um código hex válido (ex: #33FF57).',
  })
  themeSecondaryColor?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;
}