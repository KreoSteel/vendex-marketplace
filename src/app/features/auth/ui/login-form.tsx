"use client";
import { Card, CardAction, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/app/shared/ui/card";
import { Button } from "@/app/shared/ui/button";
import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "@/pkg/i18n/navigation";
import { Label } from "@/app/shared/ui/label";
import { Input } from "@/app/shared/ui/input";
import { LoginAction } from "../api/login-action";



export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(LoginAction, { success: true, data: undefined });
    const t = useTranslations("auth.login");
 
    useEffect(() => {
       if (state && "error" in state && state.error) {
          toast.error(state.error);
       }
    }, [state]);
 
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
