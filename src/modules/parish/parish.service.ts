import { 
  BadRequestException, 
  Injectable, 
  NotFoundException 
} from '@nestjs/common';
import { CreateParishDto } from './dto/create-parish.dto';
import { UpdateParishDto } from './dto/update-parish.dto';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ParishesService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(dto: CreateParishDto) {
    const slug = dto.slug || this.generateSlug(dto.name);

    const existingParish = await this.prisma.parish.findFirst({
      where: { 
        OR: [
          { document: dto.document },
          { phone: dto.phone },
          { slug },
        ],
      },
    });

    if (existingParish) {
      throw new BadRequestException('Já existe uma paróquia cadastrada com essas informações.');
    }

    return this.prisma.parish.create({
      data: {
        ...dto,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.parish.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        document: true,
        priest: true,
        createdAt: true,
        _count: {
          select: {
            tithers: true
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const parish = await this.prisma.parish.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        priest: true,
        themePrimaryColor: true,
        themeSecondaryColor: true,
        logoUrl: true,
      },
    });

    if (!parish) {
      throw new NotFoundException('Paróquia não encontrada.');
    }

    return parish;
  }

  async findOne(id: string) {
    const parish = await this.prisma.parish.findUnique({
      where: { id },
    });

    if (!parish) {
      throw new NotFoundException('Paróquia não encontrada.');
    }

    return parish;
  }

  async update(id: string, dto: UpdateParishDto) {
    await this.findOne(id);

    if (dto.slug) {
      const existingSlug = await this.prisma.parish.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      });
      
      if (existingSlug) {
        throw new BadRequestException('Este slug já está em uso por outra paróquia.');
      }
    }

    return this.prisma.parish.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.parish.delete({
      where: { id },
    });
  }
}