import { LocaleSwitcher } from "@/components/locale-switcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="absolute top-4 right-4">
                <LocaleSwitcher />
            </div>
            {children}
        </div>
    )
}