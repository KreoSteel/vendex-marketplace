import type { Metadata } from "next";
import { Montserrat, Poppins, Inter, Space_Grotesk } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";


export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vendex - Your Trusted Marketplace",
  description: "Buy and sell items in your local marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; 
}>) {
  return (
    <html lang="en">
      <body
        className={`font-inter ${inter.variable} ${montserrat.variable} ${poppins.variable} ${spaceGrotesk.variable} antialiased overflow-x-hidden`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}



