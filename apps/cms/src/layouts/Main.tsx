import T from "@/translations";
import {
	type Component,
	Switch,
	Match,
	createMemo,
	type JSXElement,
} from "solid-js";
import api from "@/services/api";
import Layout from "@/components/Groups/Layout";

interface MainLayoutProps {
	children?: JSXElement;
}

const MainLayout: Component<MainLayoutProps> = (props) => {
	// ----------------------------------
	// Mutations & Queries
	const authenticatedUser = api.account.useGetAuthenticatedUser({
		queryParams: {},
	});
	const languages = api.languages.useGetMultiple({
		queryParams: {
			queryString: "?sort=code",
			perPage: -1,
		},
	});

	// ----------------------------------
	// Memos
	const isLoading = createMemo(() => {
		return authenticatedUser.isLoading || languages.isLoading;
	});
	const isSuccess = createMemo(() => {
		return authenticatedUser.isSuccess && languages.isSuccess;
	});

	// ------------------------------------------------------
	// Render
	return (
		<div class="grid grid-cols-main-layout fixed inset-0">
			<Layout.NavigationSidebar />
			<main class="overflow-y-auto">
				<Switch>
					<Match when={isSuccess()}>{props.children}</Match>
					<Match when={isLoading()}>
						<div class="fixed inset-0 z-50 bg-primary flex items-center justify-center">
							<div class="absolute inset-0 z-20 flex-col flex items-center justify-center">
								<h1 class="text-2xl font-bold text-primaryText mt-5">
									{T("loading")}
								</h1>
							</div>
							{/* shapes */}
							<span
								class="animate-spin absolute inset-0 flex items-center z-10"
								style={{
									"animation-duration": "5s",
								}}
							>
								<span class="block  border border-border opacity-80 w-full after:pb-[100%] after:block rotate-45 translate-x-1/2" />
							</span>
							<span
								class="animate-spin absolute inset-0 flex items-center z-10"
								style={{
									"animation-duration": "5s",
								}}
							>
								<span class="block  border border-border opacity-50 w-full after:pb-[100%] after:block rotate-45 translate-x-1/3" />
							</span>
						</div>
					</Match>
				</Switch>
			</main>
		</div>
	);
};

export default MainLayout;
