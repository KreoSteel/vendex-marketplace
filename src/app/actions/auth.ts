"use server";

import { redirect } from "@/i18n/navigation";
import { auth } from "@/utils/auth";
import { signInSchema, signUpSchema } from "@/utils/zod-schemas/auth";
import { headers } from "next/headers";
import { ZodError } from "zod";
import { getTranslations } from "next-intl/server";
import { Result } from "@/types/result";

export async function signUpAction(
   _prevState: Result<void> | undefined,
   formData: FormData
): Promise<Result<void>> {
   const t = await getTranslations("auth.errors");

   const parsed = signUpSchema.safeParse({
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

export async function signInAction(
   _prevState: Result<void> | undefined,
   formData: FormData
): Promise<Result<void>> {
   const t = await getTranslations("auth.errors");

   const parsed = signInSchema.safeParse({
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

export async function signOutAction() {
   await auth.api.signOut({
      headers: await headers(),
   });

   redirect({ href: "/", locale: "en" });
}