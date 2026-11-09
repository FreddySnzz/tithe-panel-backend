import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { tenantStorage } from '../tenant/tenant.storage';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  public readonly extended = this.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const store = tenantStorage.getStore();
          const parishId = store?.parishId;

          const bypassModels = ['Parish', 'User']; 

          if (parishId && !bypassModels.includes(model)) {
            if (['findMany', 'findFirst', 'findUnique', 'update', 'updateMany', 'delete', 'deleteMany', 'aggregate', 'count'].includes(operation)) {
              (args as any).where = { ...(args as any).where, parishId };
            }

            if (['create', 'createMany'].includes(operation)) {
              if (Array.isArray((args as any).data)) {
                (args as any).data = (args as any).data.map((item: any) => ({ ...item, parishId }));
              } else {
                (args as any).data = { ...(args as any).data, parishId };
              }
            }
          }

          return query(args);
        },
      },
    },
  });

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected successfully with Prisma 7 Adapter');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}