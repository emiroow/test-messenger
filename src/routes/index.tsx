import { Navigate, type RouteObject } from "react-router-dom";
import { ChatLayout } from "../components/layouts/ChatLayout";
import ChatsPage from "../pages/ChatsPage";
import LoginPage from "../pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/chat/:id",
    element: (
      <ProtectedRoute>
        <ChatLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chats",
    element: (
      <ProtectedRoute>
        <ChatsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/chat/1" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
