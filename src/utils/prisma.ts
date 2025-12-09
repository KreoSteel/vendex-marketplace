import { PrismaClient } from "@/utils/generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { serverEnv } from "./zod-schemas/env/server";

type PrismaClientResult =
   | { success: true; data: PrismaClient }
   | { success: false; error: string };

const prismaClientSingleton = (): PrismaClientResult => {
   const connectionString = serverEnv.DATABASE_URL;
   if (!connectionString) {
      return {
         success: false,
         error: "DATABASE_URL environment variable is required",
      };
   }

   try {
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      return { success: true, data: new PrismaClient({ adapter }) };
   } catch {
      return { success: false, error: "Failed to connect to database" };
   }
};

const globalForPrisma = globalThis as unknown as {
   prisma: PrismaClientResult | undefined;
};

// Clear cached singleton in development to ensure fresh instance
if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
   delete globalForPrisma.prisma;
}

const prismaResult = globalForPrisma.prisma ?? prismaClientSingleton();
if (!prismaResult.success) {
   throw new Error(prismaResult.error);
}

const prisma: PrismaClient = prismaResult.data;

if (process.env.NODE_ENV !== "production") {
   globalForPrisma.prisma = { success: true, data: prisma };
}

export default prisma;
