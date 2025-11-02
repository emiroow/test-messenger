// React import is not required with automatic JSX runtime
import { Navigate, Route, Routes } from "react-router-dom";
import { ChatLayout } from "./components/layouts/ChatLayout";
import { conversations, messagesByConversation } from "./data/mock";
import ChatsPage from "./pages/ChatsPage";

function App() {
  return (
    <Routes>
      <Route
        path="/chat/:id"
        element={
          <ChatLayout
            conversations={conversations}
            messagesByConversation={messagesByConversation}
          />
        }
      />
      <Route
        path="/chats"
        element={<ChatsPage conversations={conversations} />}
      />
      <Route
        path="/"
        element={
          <Navigate to={`/chat/${conversations[0]?.id ?? "1"}`} replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
