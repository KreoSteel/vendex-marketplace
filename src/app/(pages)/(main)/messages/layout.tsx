import { getQueryClient } from "@/lib/queryClient";
import { conversationsWithUserOptions } from "@/lib/queries/messages";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ChatSidebar from "@/components/chat/ChatSidebar";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(conversationsWithUserOptions());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="flex h-[calc(100vh-4rem)] w-full -my-12">
                <ChatSidebar />
                <div className="flex-1 h-full overflow-hidden">
                    {children}
                </div>
            </div>
        </HydrationBoundary>
    );
}

