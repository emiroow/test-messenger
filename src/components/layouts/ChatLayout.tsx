import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { ChatHeader } from "../chat/ChatHeader";
import { MessageInput } from "../chat/MessageInput";
import { MessageList } from "../chat/MessageList";
import { ProfilePanel } from "../chat/ProfilePanel";
import { Sidebar } from "../chat/Sidebar";
import { IconX } from "../icons";
import { Button } from "../ui/button";

export const ChatLayout: React.FC = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [profileOpen, setProfileOpen] = useState(false);

  // Open profile panel on desktop, close on mobile
  useEffect(() => {
    if (isDesktop) {
      setProfileOpen(true);
    } else {
      setProfileOpen(false);
    }
  }, [isDesktop]);

  return (
    <div className="relative flex h-dvh w-full bg-(--bg) text-(--text)">
      <div className="hidden md:block">
        <Sidebar onSelect={(id) => navigate(`/${id}`)} />
      </div>

      <div className={"chat-wallpaper flex min-w-0 flex-1 flex-col"}>
        <ChatHeader
          name="Sara"
          subtitle="Online"
          onOpenSidebar={() => navigate("/")}
          onOpenProfile={() => setProfileOpen((v) => !v)}
        />
        <MessageList />
        <MessageInput />
      </div>

      {profileOpen ? (
        <div className="hidden md:block w-80 shrink-0" aria-hidden />
      ) : null}

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
              <ProfilePanel name="Sara" handle="sara" />
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
                <ProfilePanel name="Sara" handle="sara" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
