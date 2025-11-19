import {
   Package,
   User,
   Plus,
   MessageCircle,
   Heart,
   LogOut,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserProfile } from "@/lib/data-access/profile";
import { signOutAction } from "@/app/actions/auth";
import Image from "next/image";

export default async function Header() {
   const user = await getUserProfile();

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
                  <Link href="/listings/create">
                     <Button>
                        <Plus className="size-4" />
                        Create listing
                     </Button>
                  </Link>

                  {user ? (
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           {user.avatarImg ? (
                              <Image src={user.avatarImg} alt={user.name ?? "User avatar"} width={42} height={42} className="rounded-full" quality={75} sizes="42px" />
                           ) : (
                              <User className="size-6" />
                           )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <div className="flex items-center gap-2 px-2 py-1">
                              {user.avatarImg ? (
                                 <Image src={user.avatarImg} alt={user.name ?? "User avatar"} width={42} height={42} className="rounded-full" quality={75} sizes="42px" />
                              ) : (
                                 <User className="size-4" />
                              )}
                              <div className="flex flex-col">
                                 <p className="text-xs">{user.name}</p>
                                 <span className="text-xs text-neutral-500">
                                    {user.location || "No location set"}
                                 </span>
                              </div>
                           </div>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem asChild className="hover:bg-neutral-100">
                              <Link href="/profile">
                                 <User className="size-4" />
                                 My Profile
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild className="hover:bg-neutral-100">
                              <Link href="/profile">
                                 <MessageCircle className="size-4" />
                                 Messages
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild className="hover:bg-neutral-100">
                              <Link href="/profile">
                                 <Heart className="size-4" />
                                 Favorites
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem asChild className="hover:bg-neutral-100">
                              <Button variant="ghost" onClick={signOutAction} className="w-full justify-start">
                                 <LogOut className="size-4" />
                                 Logout
                              </Button>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ) : (
                     <Link href="/auth/login">
                        <User className="size-6" />
                     </Link>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
}
