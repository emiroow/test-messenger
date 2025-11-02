import React from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "../ui/avatar";

export type MessageBubbleProps = {
  author: "me" | "them";
  content: string;
  time: string;
  avatar?: string | null;
  name?: string;
  showAvatar?: boolean;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  author,
  content,
  time,
  avatar,
  name,
  showAvatar,
}) => {
  const isMe = author === "me";

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {!isMe && showAvatar ? (
        <Avatar
          size="sm"
          src={avatar || undefined}
          fallback={name?.[0] || "?"}
        />
      ) : (
        <div className="w-8" />
      )}

      <div
        className={cn(
          "max-w-[75%] space-y-1",
          isMe ? "items-end text-right" : "items-start text-left"
        )}
      >
        {!isMe && name ? (
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {name}
          </div>
        ) : null}
        <div
          dir="auto"
          className={cn(
            "rounded-2xl px-3 py-2 text-sm leading-relaxed",
            isMe
              ? "bg-(--bubble-me) text-(--bubble-me-text) rounded-br-sm"
              : "bg-(--bubble-them) text-(--bubble-them-text) rounded-bl-sm"
          )}
        >
          {content}
        </div>
        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
          {time}
        </div>
      </div>

      {isMe ? <div className="w-8" /> : null}
    </div>
  );
};
