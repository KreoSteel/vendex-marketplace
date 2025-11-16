import RecentListings from "@/components/home/RecentListings";


export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-linear-to-b from-primary-100/80 via-white to-white">
        <main className="max-w-7xl mx-auto font-montserrat">
            {children}
        </main>
    </div>
  );
}
