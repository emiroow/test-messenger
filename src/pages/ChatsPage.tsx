import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/chat/Sidebar";
import { conversations as defaultConversations } from "../data/mock";
import { useIsDesktop } from "../hooks/useIsDesktop";

export const ChatsPage: React.FC<{
  conversations?: typeof defaultConversations;
}> = ({ conversations = defaultConversations }) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  // On desktop, redirect to the first chat; this page is mobile-only UX
  useEffect(() => {
    if (isDesktop) {
      const firstId = conversations[0]?.id ?? "1";
      navigate(`/chat/${firstId}`, { replace: true });
    }
  }, [isDesktop, conversations, navigate]);
  return (
    <div className="flex h-dvh w-full bg-(--bg) text-(--text)">
      <Sidebar
        items={conversations}
        onSelect={(id) => navigate(`/chat/${id}`)}
      />
    </div>
  );
};

export default ChatsPage;
