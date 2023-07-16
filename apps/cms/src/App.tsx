import type { Component } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
// Components
import Router from "@/Router";

const queryClient = new QueryClient();

const App: Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
};

export default App;
