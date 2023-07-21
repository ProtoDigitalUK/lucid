import type { Component } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Toaster } from "solid-toast";
// Components
import Router from "@/Router";

const queryClient = new QueryClient();

const App: Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          duration: 5000,
          position: "bottom-right",
        }}
      />
      <Router />
    </QueryClientProvider>
  );
};

export default App;
