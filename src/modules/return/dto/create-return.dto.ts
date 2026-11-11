import { PaymentMethod } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateReturnDto {
  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty({ message: 'O mês de referência deve ser entre 1 e 12.' })
  referenceMonth!: number;

  @IsInt()
  @Min(2024)
  @IsNotEmpty({ message: 'O ano de referência é obrigatório.' })
  referenceYear!: number;

  @IsInt({ message: 'O valor deve ser um número inteiro representando os centavos.' })
  @Min(100, { message: 'O valor mínimo é R$ 1,00 (100 centavos).' })
  value!: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty({ message: 'O método de pagamento é obrigatório.' })
  paymentMethod!: PaymentMethod;
}