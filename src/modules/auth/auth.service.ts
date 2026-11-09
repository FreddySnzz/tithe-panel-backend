import { 
  ConflictException, 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(phone: string, pass: string) {
    const user = await this.prisma.extended.user.findUnique({
      where: { phone },
    });
    
    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciais inválidas ou usuário inativo');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, parishId: user.parishId, role: user.role };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        role: user.role,
        parishId: user.parishId,
      }
    };
  }

  async register(data: RegisterDto) {
    const userExists = await this.prisma.extended.user.findUnique({
      where: { phone: data.phone },
    });

    if (userExists) {
      throw new ConflictException('Este telefone já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.prisma.extended.user.create({
      data: {
        phone: data.phone,
        password: hashedPassword,
        parishId: data.parishId,
        role: Role.TITHER, 
        active: true,
        tither: {
          create: {
            parishId: data.parishId,
            name: data.name,
            birthDate: new Date(data.birthDate), 
            civilStatus: data.civilStatus,
            phoneSecondary: data.phoneSecondary,
            ministry: data.ministry,
            spouseName: data.spouseName,
            marriageDate: data.marriageDate ? new Date(data.marriageDate) : null,
            community: data.community,
            street: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
          },
        },
      },
      include: {
        tither: true,
      },
    });

    const payload = { sub: newUser.id, parishId: newUser.parishId, role: newUser.role };
    const access_token = await this.jwtService.signAsync(payload);

   newUser.password = "";

    return {
      message: 'Cadastro realizado com sucesso',
      access_token,
      user: newUser,
    };
  }
}