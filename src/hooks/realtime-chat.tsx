'use client'

import { ChatMessageItem } from '@/components/chat-message'
import {
  type ChatMessage,
  useRealtimeChat,
} from '@/hooks/use-realtime-chat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

interface RealtimeChatProps {
  roomName: string
  username: string
  onMessage?: (messages: ChatMessage[]) => void
  onSendMessage?: (message: string) => Promise<ChatMessage | undefined>
  messages?: ChatMessage[]
}

/**
 * Realtime chat component
 * @param roomName - The name of the room to join. Each room is a unique chat.
 * @param username - The username of the user
 * @param onMessage - The callback function to handle the messages. Useful if you want to store the messages in a database.
 * @param messages - The messages to display in the chat. Useful if you want to display messages from a database.
 * @returns The chat component
 */
export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  onSendMessage,
  messages: initialMessages = [],
}: RealtimeChatProps) => {
  const messagesRef = useRef<HTMLDivElement>(null)
  const tChat = useTranslations("chat");
  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })
  const [newMessage, setNewMessage] = useState('')

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...(initialMessages || []), ...realtimeMessages]
    // Remove duplicates based on message id and filter out invalid messages
    const uniqueMessages = mergedMessages
      .filter((message) => message && message.id && message.content)
      .filter((message, index, self) => index === self.findIndex((m) => m.id === message.id))
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    return sortedMessages
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [allMessages])

   const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected) return

      const messageContent = newMessage
      setNewMessage('')

      if(onSendMessage) {
        const createdMessage = await onSendMessage(messageContent)

        if(createdMessage) {
          sendMessage(createdMessage.content, createdMessage.id)
        }
      }
   }, [newMessage, isConnected, onSendMessage, sendMessage]);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased overflow-hidden">
      {/* Messages */}
      {allMessages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Send className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">{tChat("noMessagesYet")}</p>
          <p className="text-sm text-muted-foreground/70">{tChat("startConversation")}</p>
        </div>
      ) : (
        <div ref={messagesRef} className="flex-1 min-h-0 overflow-y-auto p-4">
          {allMessages.map((message, index) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null
            const showHeader = !prevMessage || prevMessage.user.name !== message.user.name

            return (
              <div key={message.id}>
                <ChatMessageItem
                  message={message}
                  isOwnMessage={message.user.name === username}
                  showHeader={showHeader}
                />
              </div>
            )
          })}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex w-full gap-2 border-t border-border p-4 bg-background">
        <Input
          className="flex-1 rounded-full bg-muted/50 text-sm"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={tChat("typeMessage")}
          disabled={!isConnected}
        />
        <Button
          className="aspect-square rounded-full"
          type="submit"
          disabled={!isConnected || !newMessage.trim()}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
