import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'O telefone deve ser uma string válida.' })
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  phone!: string;

  @IsString({ message: 'A senha deve ser uma string válida.' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Length(6, 100, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password!: string;
}