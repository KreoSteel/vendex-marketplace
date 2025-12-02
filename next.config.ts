import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : "";

/**
 * @type {NextConfig}
 */
const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "vowmxjptenlcruamtfaa.supabase.co",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "images.unsplash.com",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "picsum.photos",
            pathname: "/**",
         },
         {
            protocol: "https",
            hostname: "i.pravatar.cc",
            pathname: "/**",
         },
      ],
   },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
