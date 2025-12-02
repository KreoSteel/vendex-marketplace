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
import { signInAction } from "@/app/actions/auth";
import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
   const [state, formAction, isPending] = useActionState(signInAction, {
      error: "",
   });
   const t = useTranslations("auth.login");

   return (
      <Card className="w-full bg-surface max-w-md shadow-lg hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300">
         <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>
               {t("description")}
            </CardDescription>
            <CardAction>
               <Button variant="link" asChild>
                  <Link href="/auth/register">{t("signUp")}</Link>
               </Button>
            </CardAction>
         </CardHeader>
         <form action={formAction}>
            <CardContent>
               {state?.error && (
                  <p className="text-red-500 text-sm">{state?.error}</p>
               )}
               <div className="flex flex-col gap-6">
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
                     <Input name="password" type="password" required />
                  </div>
               </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 mt-4">
               <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? t("buttonLoginLoading") : t("buttonLogin")}
               </Button>
            </CardFooter>
         </form>
      </Card>
   );
}
