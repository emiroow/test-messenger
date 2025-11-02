import { motion } from "framer-motion";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { MessageBubble } from "./MessageBubble";

// Sample messages for UI display only
const sampleMessages = [
  {
    id: "m1",
    author: "them" as const,
    content: "سلام! پروژه به کجا رسید؟",
    time: "4:11 PM",
  },
  {
    id: "m2",
    author: "me" as const,
    content: "سلام، تسک‌ها 90% انجام شده. الان روی UI کار می‌کنم.",
    time: "4:27 PM",
  },
  {
    id: "m3",
    author: "them" as const,
    content: "عالیه! هر وقت آماده شد خبر بده.",
    time: "4:31 PM",
  },
];

export const MessageList: React.FC = () => {
  return (
    <ScrollArea className="flex-1 px-4 py-4">
      <div className="mx-auto max-w-3xl space-y-3">
        {/* Date divider */}
        <motion.div
          className="py-2 text-center text-xs opacity-70"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Sun, Nov 1
        </motion.div>

        {sampleMessages.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
          >
            <MessageBubble
              author={m.author}
              content={m.content}
              time={m.time}
              name={m.author === "them" ? "Sara" : "Me"}
              showAvatar={m.author === "them" && i === 0}
            />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
};
