import T from "@/translations";
import { Component, Match, Switch, createMemo } from "solid-js";
import { useLocation } from "@solidjs/router";
// Services
import api from "@/services/api";
// Componetns
import Layout from "@/components/Groups/Layout";
import GeneralSettingsRoute from "@/routes/Settings/General";

const SettingsListRoute: Component = () => {
	// ----------------------------------
	// State / Hooks
	const location = useLocation();

	// ----------------------------------
	// Queries
	const settingsData = api.settings.useGetSettings({
		queryParams: {},
	});

	// ----------------------------------
	// Memos
	const currentTab = createMemo(() => {
		const path = location.pathname;
		if (path === "/settings") return "general";
		if (path === "/settings/integrations") return "integrations";
		return "";
	});

	// ----------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T("settings_route_title")}
			description={T("settings_route_description")}
			state={{
				isLoading: settingsData.isLoading,
				isError: settingsData.isError,
				isSuccess: settingsData.isSuccess,
			}}
			headingChildren={
				<Layout.NavigationTabs
					tabs={[
						{
							label: T("general"),
							href: "/settings",
						},
						{
							label: T("integrations"),
							href: "/settings/integrations",
						},
					]}
				/>
			}
		>
			<Layout.PageContent>
				<Switch>
					<Match when={currentTab() === "general"}>
						<GeneralSettingsRoute
							settings={settingsData.data?.data}
						/>
					</Match>
					<Match when={currentTab() === "integrations"}>
						integrations settings
					</Match>
				</Switch>
			</Layout.PageContent>
		</Layout.PageLayout>
	);
};

export default SettingsListRoute;
