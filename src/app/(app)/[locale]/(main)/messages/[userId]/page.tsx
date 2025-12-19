import Chat from "@/app/features/chat/ui/Chat";
import ChatHeader from "@/app/widgets/chat/ui/ChatHeader";
import { getUserProfile } from "@/app/api/profile/data-access/profile";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function ChatPage({
   params,
}: {
   params: Promise<{ userId: string }>;
}) {
   const { userId } = await params;

   const [currentUserResult, otherUserResult] = await Promise.all([
      getUserProfile(),
      getUserProfile(userId),
   ]);

   const currentUser = currentUserResult.success
      ? currentUserResult.data
      : null;
   const otherUser = otherUserResult.success ? otherUserResult.data : null;

   if (!otherUser) {
      notFound();
   }

   return (
      <div className="flex flex-col h-full">
         <ChatHeader
            user={{
               id: otherUser.id,
               name: otherUser.name,
               avatarImg: otherUser.avatarImg,
            }}
         />
         <div className="flex-1 min-h-0">
            <Chat
               userId={userId}
               username={currentUser?.name || undefined}
               currentUserId={currentUser?.id || ""}
            />
         </div>
      </div>
   );
}
