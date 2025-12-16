import { Inter, Montserrat, Poppins } from "next/font/google";

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
