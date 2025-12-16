import { inter, montserrat, poppins } from "@/config/styles/fonts";
import { QueryProvider } from "@/app/(app)/providers/query-provider";
import { Locale, NextIntlClientProvider } from "next-intl";
import { hasLocale } from "next-intl";
import { routing } from "@/pkg/i18n/routing";
import { notFound } from "next/navigation";
import {
   getMessages,
   getTranslations,
   setRequestLocale,
} from "next-intl/server";
import "@/config/styles/globals.css";
import * as Sentry from "@sentry/nextjs";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
   props: Omit<LayoutProps<"/[locale]">, "children">
) {
   const { locale } = await props.params;

   const t = await getTranslations({
      locale: locale as Locale,
      namespace: "LocaleLayout",
   });

   return {
      title: t("title"),
      description: t("description"),
   };
}

export default async function LocaleLayout({
   children,
   params,
}: LayoutProps<"/[locale]">) {
   const { locale } = await params;
   if (!hasLocale(routing.locales, locale)) {
      notFound();
   }

   setRequestLocale(locale);
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
