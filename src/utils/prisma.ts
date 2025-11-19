import { PrismaClient } from "./generated/client";

const prismaClientSingleton = () => {
  const accelerateUrl = process.env.PRISMA_ACCELERATE_URL;
  
  if (!accelerateUrl) {
    throw new Error(
      "PRISMA_ACCELERATE_URL environment variable is required. " +
      "Please set it in your .env file with your Prisma Accelerate connection string."
    );
  }
  
  return new PrismaClient({
    accelerateUrl,
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

const prismaClient = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

export default prismaClient;
