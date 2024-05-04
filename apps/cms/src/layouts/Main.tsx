import {
	type Component,
	Switch,
	Match,
	createMemo,
	type JSXElement,
} from "solid-js";
import LogoIcon from "@/assets/svgs/logo-icon.svg";
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
						<div class="fixed inset-0 z-50 bg-container-1 flex items-center justify-center">
							<div class="absolute inset-0 z-20 flex-col flex items-center justify-center">
								<img
									src={LogoIcon}
									alt="logo"
									class="size-6 animate-spin"
								/>
							</div>
						</div>
					</Match>
				</Switch>
			</main>
		</div>
	);
};

export default MainLayout;
