import Chat from "@/components/chat/Chat";
import ChatHeader from "@/components/chat/ChatHeader";
import { getUserProfile } from "@/lib/data-access/profile";
import { notFound } from "next/navigation";

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
   const { userId } = await params;
   
   const [currentUser, otherUser] = await Promise.all([
      getUserProfile(),
      getUserProfile(userId),
   ]);

   if (!otherUser) {
      notFound();
   }

   return (
      <div className="flex flex-col h-full">
         <ChatHeader user={{
            id: otherUser.id,
            name: otherUser.name,
            avatarImg: otherUser.avatarImg,
         }} />
         <div className="flex-1 min-h-0">
            <Chat 
               userId={userId} 
               username={currentUser?.name ?? undefined} 
               currentUserId={currentUser?.id ?? ""} 
            />
         </div>
      </div>
   );
}
