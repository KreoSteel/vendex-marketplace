import {
   Package,
   User,
   Plus,
   MessageCircle,
   Heart,
   LogOut,
   LogIn,
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
import { signOutAction } from "@/app/actions/auth";
import Image from "next/image";
import { getUser } from "@/utils/auth";
import SearchBar from "../ui/search";

export default async function Header() {
   const user = await getUser();

   return (
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
         <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between gap-4">
               <Link href="/" className="flex items-center gap-2 group shrink-0">
                  <div className="p-1.5 rounded-lg bg-primary-500 text-white group-hover:bg-primary-600 transition-colors">
                     <Package className="h-5 w-5" />
                  </div>
                  <span className="font-poppins text-2xl font-bold text-neutral-900 tracking-tight">
                     Vendex
                  </span>
               </Link>
               
               <div className="hidden md:block flex-1 max-w-md">
                  <SearchBar />
               </div>

               <div className="flex items-center gap-4 shrink-0">
                  {user ? (
                     <Link href="/listings/create">
                        <Button>
                           <Plus className="size-4" />
                           Create listing
                        </Button>
                     </Link>
                  ) : (
                     <div className="flex items-center gap-2">
                        <Link href="/auth/register">
                           <Button>
                              <User className="size-4" />
                              Sign Up
                           </Button>
                        </Link>
                        <Link href="/auth/login">
                           <Button variant="outline">
                              <LogIn className="size-4" />
                              Sign In
                           </Button>
                        </Link>
                     </div>
                  )}

                  {user ? (
                     <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                           {user.avatarImg ? (
                              <Image
                                 src={user.avatarImg}
                                 alt={user.name ?? "User avatar"}
                                 width={42}
                                 height={42}
                                 className="rounded-full object-cover"
                                 sizes="42px"
                              />
                           ) : (
                              <div className="size-10 rounded-full bg-primary-100 flex items-center justify-center">
                                 <User className="size-5 text-primary-600" />
                              </div>
                           )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <div className="flex items-center gap-2 px-2 py-1">
                              {user.avatarImg ? (
                                 <Image
                                    src={user.avatarImg}
                                    alt={user.name ?? "User avatar"}
                                    width={42}
                                    height={42}
                                    className="rounded-full object-cover"
                                    sizes="42px"
                                 />
                              ) : (
                                 <div className="size-10 rounded-full bg-primary-100 flex items-center justify-center">
                                    <User className="size-5 text-primary-600" />
                                 </div>
                              )}
                              <div className="flex flex-col">
                                 <p className="text-sm font-medium">{user.name}</p>
                                 <span className="text-xs text-neutral-500">
                                    {user.location || "No location set"}
                                 </span>
                              </div>
                           </div>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              asChild
                              className="hover:bg-neutral-100">
                              <Link href="/profile">
                                 <User className="size-4" />
                                 My Profile
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              asChild
                              className="hover:bg-neutral-100">
                              <Link href="/messages">
                                 <MessageCircle className="size-4" />
                                 Messages
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              asChild
                              className="hover:bg-neutral-100">
                              <Link href="/profile">
                                 <Heart className="size-4" />
                                 Favorites
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              asChild
                              className="hover:bg-neutral-100">
                              <Button
                                 variant="ghost"
                                 onClick={signOutAction}
                                 className="w-full justify-start">
                                 <LogOut className="size-4" />
                                 Logout
                              </Button>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  ) : null}
               </div>
            </div>
         </div>
      </header>
   );
}
