import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  currentUserId,
  type Conversation,
  type Message,
} from "../../data/mock";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { ChatHeader } from "../chat/ChatHeader";
import { MessageInput } from "../chat/MessageInput";
import { MessageList } from "../chat/MessageList";
import { ProfilePanel } from "../chat/ProfilePanel";
import { Sidebar } from "../chat/Sidebar";
import { IconX } from "../icons";
import { Button } from "../ui/button";

export const ChatLayout: React.FC<{
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
}> = ({ conversations, messagesByConversation }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const initialId = conversations[0]?.id ?? "";
  const activeId =
    id && conversations.some((c) => c.id === id) ? id : initialId;
  const [messagesMap, setMessagesMap] = useState(messagesByConversation);
  const isDesktop = useIsDesktop();
  const [profileOpen, setProfileOpen] = useState(false);

  // Default: open on desktop, hidden on mobile; allow user toggles afterwards
  useEffect(() => {
    if (isDesktop) setProfileOpen(true);
  }, [isDesktop]);

  // Ensure URL always has a valid chat id
  useEffect(() => {
    if (!id || !conversations.some((c) => c.id === id)) {
      if (initialId) navigate(`/chat/${initialId}`, { replace: true });
    }
  }, [id, conversations, initialId, navigate]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || conversations[0],
    [conversations, activeId]
  );

  const messages = messagesMap[active.id] ?? [];

  const handleSend = (text: string) => {
    const msg: Message = {
      id: Math.random().toString(36).slice(2),
      userId: currentUserId,
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessagesMap((prev) => ({
      ...prev,
      [active.id]: [...(prev[active.id] ?? []), msg],
    }));
  };

  return (
    <div className="relative flex h-dvh w-full bg-(--bg) text-(--text)">
      {/* Sidebar (left) fixed on md+, drawer on small */}
      <div className="hidden md:block">
        <Sidebar
          items={conversations}
          activeId={active.id}
          onSelect={(nextId) => navigate(`/chat/${nextId}`)}
        />
      </div>

      {/* Main chat (center) */}
      <div className={"chat-wallpaper flex min-w-0 flex-1 flex-col"}>
        <ChatHeader
          name={active.name}
          avatar={active.avatar}
          subtitle={active.online ? "Online" : "Last seen recently"}
          onOpenSidebar={() => navigate("/chats")}
          onOpenProfile={() => setProfileOpen((v) => !v)}
        />
        <MessageList messages={messages} name={active.name} />
        <MessageInput onSend={handleSend} />
      </div>

      {/* Reserve space when profile panel is open so header/buttons remain visible (desktop only) */}
      {profileOpen ? (
        <div className="hidden md:block w-80 shrink-0" aria-hidden />
      ) : null}

      {/* Desktop profile panel (animated toggle) */}
      <AnimatePresence>
        {profileOpen && (
          <motion.aside
            initial={{ x: 96, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 top-0 z-20 hidden h-full w-80 md:block"
          >
            <div className="relative h-full">
              <ProfilePanel
                name={active.name}
                avatar={active.avatar}
                handle={active.handle}
                userId={active.userId}
              />
              <div className="absolute right-2 top-2">
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Close profile"
                  onClick={() => setProfileOpen(false)}
                >
                  <IconX className="size-5" />
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile profile overlay (full screen) */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setProfileOpen(false)}
            />
            <motion.div
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="absolute inset-0 bg-(--panel)"
            >
              <div className="absolute right-2 top-2 z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="Close profile"
                  onClick={() => setProfileOpen(false)}
                  className="h-10 w-10"
                >
                  <IconX className="size-5" />
                </Button>
              </div>
              <div className="h-full overflow-y-auto">
                <ProfilePanel
                  name={active.name}
                  avatar={active.avatar}
                  handle={active.handle}
                  userId={active.userId}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile chats list is a dedicated page at /chats. Drawer removed. */}
    </div>
  );
};
