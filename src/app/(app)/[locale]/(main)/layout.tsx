import Header from "@/app/widgets/header/Header";
import { Toaster } from "@/app/shared/ui/sonner";
export default async function MainLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <>
            <Toaster />
            <Header />
            <div className="mx-auto px-4 py-12 font-inter max-w-3/4">
                {children}
            </div>
        </>
    )
    
}

