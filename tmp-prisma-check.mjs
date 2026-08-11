import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

try {
  await prisma.$connect();
  const res = await prisma.user.create({ data: { name: 'Test', email: 'test@example.com', passwordHash: 'hash' } });
  console.log('created', res);
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}
