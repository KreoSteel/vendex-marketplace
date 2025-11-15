
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-linear-to-b from-primary-100 via-primary-100/40">
        <main className="max-w-7xl mx-auto font-montserrat">
            {children}
        </main>
    </div>
  );
}
