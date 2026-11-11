import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashPassword = await bcrypt.hash('asdf1234', 10);
  const phone = '86994147549';

  const superAdmin = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: {
      "name": "Fredson Super ADMIN",
      phone,
      "password": hashPassword,
      "active": true,
      "role": Role.SUPER_ADMIN
    }
  });

  console.log({ superAdmin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });