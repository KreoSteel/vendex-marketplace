import { inter, montserrat, poppins } from "@/config/styles/fonts";
import { QueryProvider } from "@/app/(app)/providers/query-provider";
import { NextIntlClientProvider } from "next-intl";
import { hasLocale } from "next-intl";
import { routing } from "@/pkg/i18n/routing";
import { notFound } from "next/navigation";
import "@/config/styles/globals.css";
import * as Sentry from "@sentry/nextjs";
import { getLocale } from "next-intl/server";
import { getMessages, getTranslations } from "next-intl/server";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
) {
   const t = await getTranslations("LocaleLayout");

   return {
      title: t("title"),
      description: t("description"),
   };
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
   const locale = await getLocale();
   if (!hasLocale(routing.locales, locale)) {
      notFound();
   }
   let messages;
   try {
      messages = await getMessages();
   } catch (error) {
      Sentry.captureException(error, {
         tags: {
            area: "i18n",
            file: "layout.tsx",
         },
      });
      messages = {};
   }

   return (
      <html lang={locale}>
         <body
            className={`font-inter ${inter.variable} ${montserrat.variable} ${poppins.variable} antialiased overflow-x-hidden`}>
            <QueryProvider>
               <NextIntlClientProvider messages={messages} locale={locale}>
                  {children}
               </NextIntlClientProvider>
            </QueryProvider>
         </body>
      </html>
   );
}
