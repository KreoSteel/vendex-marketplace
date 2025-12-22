export interface UseRealtimeChatProps {
    roomName: string;
    username: string;
 }
 
 export interface ChatMessage {
    id: string;
    content: string;
    user: {
       name: string;
    };
    createdAt: string;
 }