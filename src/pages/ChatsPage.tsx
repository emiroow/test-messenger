import React from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/chat/Sidebar";

export const ChatsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-dvh w-full bg-(--bg) text-(--text)">
      <Sidebar onSelect={(id) => navigate(`/${id}`)} />
    </div>
  );
};

export default ChatsPage;
