import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTitherDto } from './dto/create-tither.dto';
import { UpdateTitherDto } from './dto/update-tither.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class TitherService {
  constructor(private readonly prisma: PrismaService) {}

  async createByAdmin(parishId: string, dto: CreateTitherDto) {
    const userExists = await this.prisma.extended.user.findUnique({
      where: { phone: dto.phone },
    });

    if (userExists) {
      throw new ConflictException('Já existe um cadastro com este telefone.');
    }

    const rawPassword = dto.password || dto.phone.replace(/\D/g, '').slice(0, 6);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    return this.prisma.extended.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          password: hashedPassword,
          role: Role.TITHER,
        },
      });

      const tither = await tx.tither.create({
        data: {
          userId: user.id,
          parishId,
          birthDate: new Date(dto.birthDate),
          phoneSecondary: dto.phoneSecondary,
          civilStatus: dto.civilStatus,
          spouseName: dto.spouseName,
          marriageDate: dto.marriageDate ? new Date(dto.marriageDate) : null,
          ministry: dto.ministry,
          community: dto.community,
          street: dto.street,
          neighborhood: dto.neighborhood,
          city: dto.city,
          state: dto.state,
        },
        include: {
          user: {
            select: { 
              id: true, 
              name: true, 
              phone: true, 
              active: true 
            },
          },
        },
      });

      return tither;
    });
  }

  async findAll(search?: string) {
    return this.prisma.extended.tither.findMany({
      where: search
        ? {
            OR: [
              { user: { name: { contains: search, mode: 'insensitive' } } },
              { user: { phone: { contains: search } } },
              { community: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            active: true 
          },
        },
      },
      orderBy: {
        user: { name: 'asc' },
      },
    });
  }

  async findByUserId(userId: string) {
    const tither = await this.prisma.extended.tither.findUnique({
      where: { userId },
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            role: true, 
            active: true 
          },
        },
        parish: {
          select: {
            id: true,
            name: true,
            phone: true,
            priest: true,
            logoUrl: true,
            themePrimaryColor: true,
            themeSecondaryColor: true,
          },
        },
      },
    });

    if (!tither) {
      throw new NotFoundException('Perfil de dizimista não encontrado.');
    }

    return tither;
  }

  async findOne(id: string) {
    const tither = await this.prisma.extended.tither.findFirst({
      where: { id },
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            active: true 
          },
        },
      },
    });

    if (!tither) {
      throw new NotFoundException('Dizimista não encontrado.');
    }

    return tither;
  }

  async update(id: string, dto: UpdateTitherDto) {
    const existing = await this.findOne(id);

    if (dto.phone && dto.phone !== existing.user.phone) {
      const phoneInUse = await this.prisma.extended.user.findUnique({
        where: { phone: dto.phone },
      });

      if (phoneInUse) {
        throw new ConflictException('Este telefone já está em uso por outro usuário.');
      }
    }

    const { name, phone, birthDate, marriageDate, ...titherData } = dto;

    return this.prisma.extended.tither.update({
      where: { id },
      data: {
        ...titherData,
        ...(birthDate && { birthDate: new Date(birthDate) }),
        ...(marriageDate !== undefined && {
          marriageDate: marriageDate ? new Date(marriageDate) : null,
        }),
        ...(name || phone
          ? {
              user: {
                update: {
                  ...(name && { name }),
                  ...(phone && { phone }),
                },
              },
            }
          : {}),
      },
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            phone: true, 
            active: true 
          },
        },
      },
    });
  }
}