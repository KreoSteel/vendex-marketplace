"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
   error,
}: {
   error: Error & { digest?: string };
}) {
   useEffect(() => {
      Sentry.captureException(error);
   }, [error]);

   return (
      <html>
         <body>
            <div className="flex items-center justify-center min-h-screen px-4">
               <div className="text-center space-y-4">
                  <h1 className="text-2xl font-bold">Something went wrong</h1>
                  <p className="text-neutral-600">
                     We encountered an unexpected error. Please try again.
                  </p>
                  <button
                     onClick={() => window.location.reload()}
                     className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                     Try again
                  </button>
               </div>
            </div>
         </body>
      </html>
   );
}