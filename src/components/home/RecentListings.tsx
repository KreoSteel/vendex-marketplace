import EmptyState from "../ui/empty-state";


export default function RecentListings() {
    const listings = 0;

    return ( 
        <section className="py-16 w-full">
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-8">
                    Recent Listings
                </h2>
            </div>
            {Array.isArray(listings) && listings.length > 0 ? (
                <div>Listings will go here</div>
            ) : (
                <EmptyState />
            )}
        </section>
    );
}