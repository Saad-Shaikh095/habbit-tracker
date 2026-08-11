import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const sqliteFilePath = databaseUrl.startsWith("file:")
  ? databaseUrl.replace(/^file:\/?\/?/, "").replace(/^\.\//, "")
  : databaseUrl;

const adapter = new PrismaBetterSqlite3({
  url: path.resolve(process.cwd(), sqliteFilePath)
});

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
