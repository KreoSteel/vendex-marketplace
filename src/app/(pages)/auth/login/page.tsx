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
import Link from "next/link";

export default function RegisterPage() {
   const [state, formAction, isPending] = useActionState(signInAction, {
      error: "",
   });

   return (
      <Card className="w-full bg-surface max-w-md shadow-lg hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300">
         <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
               Enter your credentials to login to your account
            </CardDescription>
            <CardAction>
               <Button variant="link" asChild>
                  <Link href="/auth/register">Sign Up</Link>
               </Button>
            </CardAction>
         </CardHeader>
         <form action={formAction}>
            <CardContent>
               {state.error && (
                  <p className="text-red-500 text-sm">{state.error}</p>
               )}
               <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                     />
                  </div>
                  <div className="grid gap-2">
                     <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                     </div>
                     <Input name="password" type="password" required />
                  </div>
               </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 mt-4">
               <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
               </Button>
            </CardFooter>
         </form>
      </Card>
   );
}
