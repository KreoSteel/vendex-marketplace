import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
    server: {
        DATABASE_URL: z.url().min(1),
        DIRECT_URL: z.url().min(1),
        BETTER_AUTH_SECRET: z.string().min(1),
        SUPABASE_SERVICE_ROLE_KEY: z.string().min(1)
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        DIRECT_URL: process.env.DIRECT_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
    }
})