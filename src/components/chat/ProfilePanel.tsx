import { motion } from "framer-motion";
import React from "react";
import { IconPhone, IconSearch, IconVideo } from "../icons";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export const ProfilePanel: React.FC<{
  name: string;
  avatar?: string | null;
  handle?: string;
}> = ({ name, avatar, handle }) => {
  return (
    <div className="flex h-full w-full lg:w-80 flex-col border-l border-(--border) bg-(--panel)">
      <div className="px-4 py-5">
        <div className="flex flex-col items-center gap-3">
          <Avatar size="lg" src={avatar || undefined} fallback={name[0]} />
          <div className="text-center">
            <div className="text-base font-semibold">{name}</div>
            <div className="text-xs opacity-70">
              {handle ? `@${handle}` : "Last seen recently"}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <motion.div
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="flex flex-col items-center gap-2"
          >
            <Button
              variant="secondary"
              size="icon"
              aria-label="Search"
              className="h-12 w-12"
            >
              <IconSearch className="size-5" />
            </Button>
            <span className="text-xs opacity-80">Search</span>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="flex flex-col items-center gap-2"
          >
            <Button
              variant="secondary"
              size="icon"
              aria-label="Voice call"
              className="h-12 w-12"
            >
              <IconPhone className="size-5" />
            </Button>
            <span className="text-xs opacity-80">Call</span>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="flex flex-col items-center gap-2"
          >
            <Button
              variant="secondary"
              size="icon"
              aria-label="Video call"
              className="h-12 w-12"
            >
              <IconVideo className="size-5" />
            </Button>
            <span className="text-xs opacity-80">Video</span>
          </motion.div>
        </div>
      </div>
      <Separator />
      <div className="flex-1 space-y-6 px-4 py-5">
        <section>
          <div className="mb-2 text-xs font-semibold uppercase opacity-70">
            Bio
          </div>
          <p className="text-sm opacity-90">زندگی آینه‌ست، بهش لبخند بزن ���</p>
        </section>
        <section>
          <div className="mb-2 text-xs font-semibold uppercase opacity-70">
            Mobile
          </div>
          <p className="text-sm opacity-90">0912 000 0000</p>
        </section>
        <section>
          <div className="mb-2 text-xs font-semibold uppercase opacity-70">
            Media, Links and Docs
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-(--muted)" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
