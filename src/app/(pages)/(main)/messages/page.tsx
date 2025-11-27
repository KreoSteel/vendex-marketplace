import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
   return (
      <div className="flex flex-col justify-center items-center h-full w-full bg-muted/30">
         <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquare className="w-10 h-10 text-muted-foreground" />
         </div>
         <h2 className="text-xl font-semibold text-foreground mb-1">Your Messages</h2>
         <p className="text-muted-foreground text-center max-w-xs">
            Select a conversation from the sidebar to start chatting
         </p>
      </div>
   );
}
