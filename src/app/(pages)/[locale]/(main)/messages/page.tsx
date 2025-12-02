import { MessageSquare } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function MessagesPage({
   params,
}: {
   params: Promise<{ locale: string }>;
}) {
   const { locale } = await params;
   setRequestLocale(locale);
   const tMessagesPage = await getTranslations("messagesPage");
   
   return (
      <div className="flex flex-col justify-center items-center h-full w-full bg-muted/30">
         <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquare className="w-10 h-10 text-muted-foreground" />
         </div>
         <h2 className="text-xl font-semibold text-foreground mb-1">
            {tMessagesPage("yourMessages")}
         </h2>
         <p className="text-muted-foreground text-center max-w-xs">
            {tMessagesPage("selectConversation")}
         </p>
      </div>
   );
}
