"use server"
import { Result } from "@/types/result";
import { getTranslations } from "next-intl/server";
import { registerSchema } from "../../../features/auth/model/auth-schema";
import { auth } from "@/app/shared/api/auth/auth";
import { ZodError } from "zod";
import { redirect } from "@/pkg/i18n/navigation";

export async function RegisterAction(
    _prevState: Result<void> | undefined,
    formData: FormData
 ): Promise<Result<void>> {
    const t = await getTranslations("auth.errors");
 
    const parsed = registerSchema.safeParse({
       name: formData.get("name") as string,
       email: formData.get("email") as string,
       password: formData.get("password") as string,
    });
 
    if (!parsed.success) {
       return { success: false, error: parsed.error.message };
    }
 
    try {
       await auth.api.signUpEmail({
          body: {
             name: parsed.data.name,
             email: parsed.data.email,
             password: parsed.data.password,
          },
       });
    } catch (error) {
       if (error instanceof ZodError) {
          return { success: false, error: error.message };
       }
       return { success: false, error: t("failedToCreateAccount") };
    }
    redirect({ href: "/", locale: "en" });
    return { success: true, data: undefined };
}