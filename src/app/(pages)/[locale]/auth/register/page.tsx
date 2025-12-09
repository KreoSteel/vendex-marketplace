"use client";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "@/app/actions/auth";
import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
   const [state, formAction, isPending] = useActionState(signUpAction, { success: true, data: undefined });
   const t = useTranslations("auth.register");

   return (
      <Card className="w-full bg-neutral-50 max-w-md shadow-lg hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300">
         <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
               {t("description")}
            </CardDescription>
            <CardAction>
               <Button variant="link" asChild>
                  <Link href="/auth/login">{t("signIn")}</Link>
               </Button>
            </CardAction>
         </CardHeader>
         <form action={formAction}>
            <CardContent>
               {state.success === false && (
                  <p className="text-red-500 text-sm">{state.error}</p>
               )}
               <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                     <Label htmlFor="name">{t("labelName")}</Label>
                     <Input
                        name="name"
                        type="text"
                        placeholder={t("placeholderName")}
                        required
                     />
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="email">{t("labelEmail")}</Label>
                     <Input
                        name="email"
                        type="email"
                        placeholder={t("placeholderEmail")}
                        required
                     />
                  </div>
                  <div className="grid gap-2">
                     <div className="flex items-center">
                        <Label htmlFor="password">{t("labelPassword")}</Label>
                     </div>
                     <Input name="password" type="password" placeholder={t("placeholderPassword")} required />
                  </div>
               </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 mt-4">
               <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? t("buttonRegisterLoading") : t("buttonRegister")}
               </Button>
            </CardFooter>
         </form>
      </Card>
   );
}
