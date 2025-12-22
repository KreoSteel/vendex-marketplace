"use server";

import { redirect } from "@/pkg/i18n/navigation";
import { auth } from "@/app/shared/api/auth/auth";
import { headers } from "next/headers";

export async function signOutAction() {
   await auth.api.signOut({
      headers: await headers(),
   });

   redirect({ href: "/", locale: "en" });
}