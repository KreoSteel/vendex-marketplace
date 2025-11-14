import { Package, User, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Header() {
   return (
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
         <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
               <Link href="/" className="flex items-center gap-2 group">
                  <div className="p-1.5 rounded-lg bg-primary-500 text-white group-hover:bg-primary-600 transition-colors">
                     <Package className="h-5 w-5" />
                  </div>
                  <span className="font-poppins text-2xl font-bold text-neutral-900 tracking-tight">
                     Vendex
                  </span>
               </Link>

               <nav className="hidden md:flex items-center gap-6">
                  <Link
                     href="/"
                     className="font-inter text-md font-medium text-neutral-700 hover:text-primary-600 transition-colors">
                     Home
                  </Link>
                  <Link
                     href="/listings"
                     className="font-inter text-md font-medium text-neutral-700 hover:text-primary-600 transition-colors">
                     Browse
                  </Link>
                  <Link
                     href="/categories"
                     className="font-inter text-md font-medium text-neutral-700 hover:text-primary-600 transition-colors">
                     Categories
                  </Link>
               </nav>
               <div className="flex items-center gap-4">
                <Button>
                    <Plus className="size-4" />
                    Create listing
                </Button>
                  <User className="size-6" />
               </div>
            </div>
         </div>
      </header>
   );
}
