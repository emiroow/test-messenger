import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { IconPlus, IconSend } from "../icons";
import { Button } from "../ui/button";

export const MessageInput: React.FC = () => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    // Here you can add your send logic
    console.log("Send message:", text);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 160);
    el.style.height = next + "px";
  }, [value]);

  return (
    <div className="p-3">
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <motion.div
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label="Add"
            className="h-12 w-12 rounded-full border border-(--border)"
          >
            <IconPlus className="size-5 opacity-80" />
          </Button>
        </motion.div>
        <div className="flex h-12 flex-1 items-center rounded-xl border border-(--border) bg-(--panel) px-3 focus-within:ring-2 focus-within:ring-(--primary)">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Write a message..."
            dir="auto"
            className="max-h-40 w-full resize-none bg-transparent text-sm leading-[1.2] outline-none placeholder:opacity-60 text-start"
          />
        </div>
        <motion.div
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        >
          <Button
            onClick={send}
            variant="default"
            size="md"
            aria-label="Send"
            className="h-12 rounded-lg px-4 shadow-[0_6px_20px_rgba(139,92,246,0.35)]"
          >
            <IconSend className="size-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
