import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
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

