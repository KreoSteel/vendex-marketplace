import SearchBar from "../ui/search";

export default function Hero() {
    return (
        <section className="w-full ">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-3 items-center justify-center font-montserrat">
                    <h1 className="">Find everything you need at Vendex</h1>
                    <p className="text-sm text-neutral-700 mb-10">
                        Vendex is a platform for buying and selling products.
                    </p>
                    <SearchBar />
                </div>
            </div>
        </section>
    )
}