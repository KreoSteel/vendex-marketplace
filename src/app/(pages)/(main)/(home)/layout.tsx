export default function HomeLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="relative -mt-12 pt-12">
         <div
            className="absolute h-[600px] top-0 left-[calc(-50vw+50%)] right-[calc(-50vw+50%)] w-screen bg-linear-to-b from-primary-100/80 via-white to-white pointer-events-none -z-10"
         />
         <div className="relative max-w-6xl mx-auto px-4 font-montserrat">
            {children}
         </div>
      </div>
   );
}
