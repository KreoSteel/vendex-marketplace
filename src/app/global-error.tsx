"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function GlobalError({
   error,
}: {
   error: Error & { digest?: string };
}) {
   const t = useTranslations("common");
   useEffect(() => {
      Sentry.captureException(error);
   }, [error]);

   return (
      <html>
         <body>
            <div className="flex items-center justify-center min-h-screen px-4">
               <div className="text-center space-y-4">
                  <h1 className="text-2xl font-bold">{t("errorTitle")}</h1>
                  <p className="text-neutral-600">
                     {t("errorDescription")}
                  </p>
                  <button
                     onClick={() => window.location.reload()}
                     className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                     {t("tryAgain")}
                  </button>
               </div>
            </div>
         </body>
      </html>
   );
}
