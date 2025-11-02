import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCanHover } from "../../hooks/useCanHover";
import { cn } from "../../lib/cn";
import { IconSearch, IconX } from "../icons";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { ThemeToggle } from "../ui/theme-toggle";

// Sample conversations for UI display only
const sampleConversations = [
  {
    id: "1",
    name: "Sara",
    lastMessage: "باشه ممنون ���",
    unread: 2,
    avatar: null,
  },
  {
    id: "2",
    name: "Ali Reza",
    lastMessage: "فایل رو ارسال کردم",
    avatar: null,
  },
  {
    id: "3",
    name: "Product Team",
    lastMessage: "Meeting at 3pm",
    avatar: null,
  },
];

export const Sidebar: React.FC<{
  onSelect: (id: string) => void;
}> = ({ onSelect }) => {
  const canHover = useCanHover();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="flex h-full w-full md:w-80 flex-col md:border-r border-(--border) bg-(--sidebar)">
      <div className="p-3">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-neutral-400">
            <IconSearch className="size-4" />
          </span>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="bg-(--panel) border-(--border) text-(--text) placeholder:text-neutral-400 pl-8 pr-8"
          />
          {query ? (
            <button
              aria-label="Clear search"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400",
                canHover && "hover:bg-(--muted)"
              )}
              onClick={() => setQuery("")}
            >
              <IconX className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
      <ScrollArea variant="hidden" className="flex-1">
        <ul className="px-2 flex flex-col gap-1 py-2">
          {sampleConversations.map((c, idx) => (
            <li key={c.id}>
              <motion.button
                onClick={() => onSelect(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                  canHover && "hover:bg-(--muted)"
                )}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={canHover ? { scale: 1.01 } : undefined}
                transition={{
                  delay: Math.min(idx * 0.015, 0.15),
                  duration: 0.2,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Avatar
                  size="sm"
                  src={c.avatar || undefined}
                  fallback={c.name[0]}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {c.name}
                    </span>
                    {typeof c.unread === "number" && c.unread > 0 ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black dark:bg-(--primary) px-1 text-xs font-medium text-white">
                        {c.unread}
                      </span>
                    ) : null}
                  </div>
                  <div className="truncate text-xs opacity-70">
                    {c.lastMessage}
                  </div>
                </div>
              </motion.button>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div className="border-t border-(--border) p-3">
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback="ME" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">You</div>
            <div className="truncate text-xs opacity-70">
              {localStorage.getItem("userId") || "Guest"}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
              className="h-8 w-8 text-red-500 hover:bg-red-500/10"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
