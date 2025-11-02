import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { signalRService } from "../services/signalr.service";
import { QUERY_KEYS, type Message } from "./useApi";

// Hook for SignalR connection management
export const useSignalR = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const connect = async () => {
      try {
        await signalRService.start();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      signalRService.stop();
    };
  }, []);

  return { isConnected, error };
};

// Hook for receiving new messages
export const useMessageReceived = (conversationId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleMessageReceived = (message: Message) => {
      console.log("[SignalR] Message received:", message);

      // Update messages cache
      if (conversationId && message.conversationId === conversationId) {
        queryClient.setQueryData<Message[]>(
          QUERY_KEYS.messages(conversationId),
          (old = []) => [...old, message]
        );
      }

      // Invalidate conversations to update last message
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.conversations],
      });
    };

    signalRService.on("ReceiveMessage", handleMessageReceived);

    return () => {
      signalRService.off("ReceiveMessage", handleMessageReceived);
    };
  }, [conversationId, queryClient]);
};

// Hook for user typing indicator
export const useTypingIndicator = (conversationId: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const handleUserTyping = (userId: string, convId: string) => {
      if (convId === conversationId) {
        setTypingUsers((prev) =>
          prev.includes(userId) ? prev : [...prev, userId]
        );

        // Remove after 3 seconds
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((id) => id !== userId));
        }, 3000);
      }
    };

    signalRService.on("UserTyping", handleUserTyping);

    return () => {
      signalRService.off("UserTyping", handleUserTyping);
    };
  }, [conversationId]);

  const sendTyping = async () => {
    try {
      await signalRService.invoke("SendTyping", conversationId);
    } catch (error) {
      console.error("Failed to send typing indicator:", error);
    }
  };

  return { typingUsers, sendTyping };
};

// Hook for user presence (online/offline)
export const useUserPresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleUserOnline = (userId: string) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    };

    const handleUserOffline = (userId: string) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    };

    signalRService.on("UserOnline", handleUserOnline);
    signalRService.on("UserOffline", handleUserOffline);

    return () => {
      signalRService.off("UserOnline", handleUserOnline);
      signalRService.off("UserOffline", handleUserOffline);
    };
  }, []);

  const isUserOnline = (userId: string) => onlineUsers.has(userId);

  return { onlineUsers: Array.from(onlineUsers), isUserOnline };
};

// Hook for sending messages via SignalR
export const useSendMessageViaSignalR = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (conversationId: string, content: string) => {
    setIsSending(true);
    setError(null);

    try {
      await signalRService.invoke("SendMessage", {
        conversationId,
        content,
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return { sendMessage, isSending, error };
};

// Hook for joining/leaving conversation rooms
export const useConversationRoom = (conversationId: string | null) => {
  const hasJoined = useRef(false);

  useEffect(() => {
    if (!conversationId) return;

    const joinRoom = async () => {
      try {
        await signalRService.invoke("JoinConversation", conversationId);
        hasJoined.current = true;
        console.log(`[SignalR] Joined conversation: ${conversationId}`);
      } catch (error) {
        console.error("Failed to join conversation:", error);
      }
    };

    const leaveRoom = async () => {
      if (!hasJoined.current) return;

      try {
        await signalRService.invoke("LeaveConversation", conversationId);
        console.log(`[SignalR] Left conversation: ${conversationId}`);
      } catch (error) {
        console.error("Failed to leave conversation:", error);
      }
    };

    joinRoom();

    return () => {
      leaveRoom();
    };
  }, [conversationId]);
};
