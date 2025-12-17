"use client";
import SearchBar from "@/app/shared/ui/search";
import { useTranslations } from "next-intl";

export default function Hero() {
    const t = useTranslations("home.hero");
    
    return (
        <section className="w-full ">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-3 items-center justify-center font-montserrat">
                    <h1 className="">{t("title")}</h1>
                    <p className="text-sm text-neutral-700 mb-10">{t("description")}</p>
                    <div className="w-full max-w-xl">
                    <SearchBar />
                    </div>
                </div>
            </div>
        </section>
    )
}