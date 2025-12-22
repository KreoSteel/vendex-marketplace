
import { ChatSidebar, getConversationsWithUsers } from "@/app/widgets/chat";

export default async function ChatLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const conversations = await getConversationsWithUsers();

   return (
      <div className="flex h-[calc(100vh-4rem)] w-full -my-12">
         <ChatSidebar conversations={conversations} />
         <div className="flex-1 h-full overflow-hidden">{children}</div>
      </div>
   );
}
