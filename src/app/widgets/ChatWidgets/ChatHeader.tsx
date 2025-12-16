"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/pkg/i18n/navigation";
import { useTranslations } from "next-intl";

interface ChatHeaderProps {
   user: {
      id: string;
      name: string | null;
      avatarImg: string | null;
   };
}  

export default function ChatHeader({ user }: ChatHeaderProps) {
   const tChatPage = useTranslations("chatPage");

   return (
      <div className="flex items-center gap-3 p-4 border-b bg-white">
         <Link href="/messages">
            <Button variant="ghost" size="icon" className="md:hidden">
               <ArrowLeft className="h-5 w-5" />
            </Button>
         </Link>
         <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarImg || ""} alt={user.name || tChatPage("unknownUser")} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
               {user.name?.charAt(0).toUpperCase() || tChatPage("unknownUser")}
            </AvatarFallback>
         </Avatar>
         <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
               {user.name || tChatPage("unknownUser")}
            </h3>
         </div>
         <Link href={`/profile/${user.id}`}>
            <Button variant="outline" size="sm">
               {tChatPage("viewProfile")}
            </Button>
         </Link>
      </div>
   );
}

