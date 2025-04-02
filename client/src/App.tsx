import { BrowserRouter } from "react-router";
import AppRoutes from "./Routes.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./state/queryClients.ts";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
