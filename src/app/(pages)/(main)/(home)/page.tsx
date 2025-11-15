import Hero from "@/components/home/Hero";
import BrowseByCategory from "@/components/home/Categories";
import RecentListings from "@/components/home/RecentListings";

export default function Home() {
   return (
      <>
         <Hero />
         <BrowseByCategory />
         <RecentListings />
      </>
   );
}
