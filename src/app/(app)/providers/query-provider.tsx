"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/app/shared/lib/queryClient";

interface IQueryProviderProps {
   children: React.ReactNode;
}

export function QueryProvider({ children }: IQueryProviderProps) {
   const queryClient = getQueryClient();

   return (
      <QueryClientProvider client={queryClient}>
         {children}
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   );
}