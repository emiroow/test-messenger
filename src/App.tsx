// React import is not required with automatic JSX runtime
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import { routes } from "./routes";

// Create router instance
const router = createBrowserRouter(routes);

function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
