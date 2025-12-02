import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ['en', 'ru', 'uk', 'it'],
    defaultLocale: 'en',
})