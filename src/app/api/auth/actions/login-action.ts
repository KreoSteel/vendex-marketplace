"use server";
import { Result } from "@/types/result";
import { getTranslations } from "next-intl/server";
import { loginSchema } from "../../../features/auth/model/auth-schema";
import { auth } from "@/app/shared/api/auth/auth";
import { ZodError } from "zod";
import { redirect } from "@/pkg/i18n/navigation";

export async function LoginAction(
    _prevState: Result<void> | undefined,
    formData: FormData
 ): Promise<Result<void>> {
    const t = await getTranslations("auth.errors");
 
    const parsed = loginSchema.safeParse({
       email: formData.get("email") as string,
       password: formData.get("password") as string,
    });
 
    if (!parsed.success) {
       return { success: false, error: parsed.error.message };
    }
 
    try {
       await auth.api.signInEmail({
          body: {
             email: parsed.data.email,
             password: parsed.data.password,
          },
       });
    } catch (error) {
       if (error instanceof ZodError) {
          return { success: false, error: error.message };
       }
       return { success: false, error: t("failedToLogin") };
    }
    redirect({ href: "/", locale: "en" });
    return { success: true, data: undefined };
 }