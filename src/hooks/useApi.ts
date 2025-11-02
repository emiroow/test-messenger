import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";

// Query Keys
export const QUERY_KEYS = {
  conversations: "conversations",
  messages: (conversationId: string) => ["messages", conversationId],
  user: (userId: string) => ["user", userId],
  profile: "profile",
} as const;

// Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  unread?: number;
  avatar?: string | null;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}

// ==================== Conversations ====================

export const useConversations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.conversations],
    queryFn: () => api.get<Conversation[]>("/conversations"),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// ==================== Messages ====================

export const useMessages = (conversationId: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.messages(conversationId),
    queryFn: () =>
      api.get<Message[]>(`/conversations/${conversationId}/messages`),
    enabled: enabled && !!conversationId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      api.post<Message>(`/conversations/${payload.conversationId}/messages`, {
        content: payload.content,
      }),
    onSuccess: (data, variables) => {
      // Invalidate messages query to refetch
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(variables.conversationId),
      });

      // Optionally optimistic update
      queryClient.setQueryData<Message[]>(
        QUERY_KEYS.messages(variables.conversationId),
        (old = []) => [...old, data]
      );
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    }) => api.delete(`/conversations/${conversationId}/messages/${messageId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(variables.conversationId),
      });
    },
  });
};

// ==================== User ====================

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.user(userId),
    queryFn: () => api.get(`/users/${userId}`),
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => api.put("/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile] });
    },
  });
};
