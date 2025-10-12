import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Нормалізація стилів
import "modern-normalize";

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
 <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  </React.StrictMode>
 

);