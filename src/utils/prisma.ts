import { PrismaClient } from "@/utils/generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

// Clear cached singleton in development to ensure fresh instance
if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
  delete globalForPrisma.prisma;
}

const prismaClient = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

export default prismaClient;
