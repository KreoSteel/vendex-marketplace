import Header from "@/components/layout/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <div className="mx-auto px-4 py-12 font-inter max-w-3/4">
                {children}
            </div>
        </>
    )
    
}

