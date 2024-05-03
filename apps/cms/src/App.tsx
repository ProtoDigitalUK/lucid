import type { Component } from "solid-js";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Toaster } from "solid-toast";
import { HeadlessError } from "./utils/error-handling";
import Router from "@/Router";
import "solid-devtools";

const App: Component = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: (_, error) => {
					if (error instanceof HeadlessError) {
						if (error.errorRes.status === 401) {
							return false;
						}
					}
					return true;
				},
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			<Toaster
				toastOptions={{
					duration: 5000,
					position: "bottom-left",
				}}
			/>
			<Router />
		</QueryClientProvider>
	);
};

export default App;
