import T from "@/translations";
import { type Component, Match, Switch, createMemo } from "solid-js";
import { useLocation } from "@solidjs/router";
import api from "@/services/api";
import Layout from "@/components/Groups/Layout";
import GeneralSettingsRoute from "@/routes/Settings/General";
import ComingSoon from "@/components/Blocks/ComingSoon";

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
		if (path === "/admin/settings") return "general";
		if (path === "/admin/settings/integrations") return "integrations";
		return "";
	});
	const isLoading = createMemo(() => settingsData.isLoading);
	const isError = createMemo(() => settingsData.isError);
	const isSuccess = createMemo(() => settingsData.isSuccess);

	// ----------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T()("settings_route_title")}
			description={T()("settings_route_description")}
			state={{
				isLoading: isLoading(),
				isError: isError(),
				isSuccess: isSuccess(),
			}}
			headingChildren={
				<Layout.NavigationTabs
					tabs={[
						{
							label: T()("general"),
							href: "/admin/settings",
						},
						{
							label: T()("integrations"),
							href: "/admin/settings/integrations",
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
						<ComingSoon />
					</Match>
				</Switch>
			</Layout.PageContent>
		</Layout.PageLayout>
	);
};

export default SettingsListRoute;
