import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnStatus } from '@prisma/client';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  async getMyAnnualCalendar(userId: string, year: number) {
    const existingReturns = await this.prisma.extended.return.findMany({
      where: {
        userId,
        referenceYear: year,
      },
    });

    const monthsMap = new Map(
      existingReturns.map((item) => [item.referenceMonth, item])
    );

    const calendar = [];
    for (let month = 1; month <= 12; month++) {
      const record = monthsMap.get(month);
      calendar.push({
        month,
        year,
        status: record ? record.status : 'PENDING',
        value: record ? Number(record.value) : 0,
        paidAt: record?.paidAt || null,
        returnId: record?.id || null,
      });
    }

    return {
      year,
      calendar,
    };
  }

  async processReturn(userId: string, parishId: string, dto: CreateReturnDto) {
    const existingPaid = await this.prisma.extended.return.findFirst({
      where: {
        userId,
        referenceMonth: dto.referenceMonth,
        referenceYear: dto.referenceYear,
        status: ReturnStatus.PAID,
      },
    });

    if (existingPaid) {
      throw new BadRequestException('O dízimo para este mês já foi devolvido.');
    }

    const returnRecord = await this.prisma.extended.return.create({
      data: {
        userId,
        parishId,
        referenceMonth: dto.referenceMonth,
        referenceYear: dto.referenceYear,
        value: dto.value,
        status: ReturnStatus.PENDING,
        paymentMethod: dto.paymentMethod,
        paidAt: new Date(),
      },
    });

    return {
      message: 'Devolução registrada com sucesso!',
      id: returnRecord.id,
      status: returnRecord.status,
    };
  }

  async getParishReport(year: number, month: number, parishId?: number) {
    const whereClause: any = {};
    if (parishId) whereClause.parishId = parishId;

    const tithers = await this.prisma.extended.tither.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            active: true,
          },
        },
      },
    });

    const returns = await this.prisma.extended.return.findMany({
      where: {
        referenceYear: year,
        referenceMonth: month,
        status: ReturnStatus.PAID,
      },
    });

    const paidUserIds = new Set(returns.map((r) => r.userId));

    const report = tithers.map((tither) => ({
      titherId: tither.id,
      name: tither.user.name,
      phone: tither.user.phone,
      hasReturned: paidUserIds.has(tither.userId),
    }));

    return {
      year,
      month,
      totalTithers: tithers.length,
      totalPaid: returns.length,
      pendingCount: tithers.length - returns.length,
      report,
    };
  }
}