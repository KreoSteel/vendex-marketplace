"use server";

import { redirect } from "@/i18n/navigation";
import { auth } from "@/utils/auth";
import { signInSchema, signUpSchema } from "@/utils/zod-schemas/auth";
import { headers } from "next/headers";
import { ZodError } from "zod";

export async function signUpAction(
   prevState: { error: string } | undefined,
   formData: FormData
) {
   const parsed = signUpSchema.safeParse({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
   });

   if (!parsed.success) {
      return { error: parsed.error.message };
   }

   try {
      await auth.api.signUpEmail({
         body: {
            name: parsed.data.name,
            email: parsed.data.email,
            password: parsed.data.password,
         },
      });
   } catch {
      return { error: "Failed to create account" };
   }
   redirect({ href: "/", locale: "en" });
}

export async function signInAction(
   prevState: { error: string } | undefined,
   formData: FormData
) {
   const parsed = signInSchema.safeParse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
   });

   if (!parsed.success) {
      return { error: parsed.error.message };
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
         return { error: error.message };
      }
      return { error: "Failed to login" };
   }
   redirect({ href: "/", locale: "en" });
}

export async function signOutAction() {
   await auth.api.signOut({
      headers: await headers(),
   });

   redirect({ href: "/", locale: "en" });
}