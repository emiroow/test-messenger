import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/chat/Sidebar";
import { useIsDesktop } from "../hooks/useIsDesktop";

export const ChatsPage: React.FC = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  // On desktop, redirect to the first chat
  useEffect(() => {
    if (isDesktop) {
      navigate("/chat/1", { replace: true });
    }
  }, [isDesktop, navigate]);

  return (
    <div className="flex h-dvh w-full bg-(--bg) text-(--text)">
      <Sidebar onSelect={(id) => navigate(`/chat/${id}`)} />
    </div>
  );
};

export default ChatsPage;
