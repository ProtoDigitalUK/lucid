import { Component } from "solid-js";
import T from "@/translations";
// Services
import api from "@/services/api";
// Store
import userStore from "@/store/userStore";
// Components
import Button from "@/components/Partials/Button";
import Layout from "@/components/Groups/Layout";
import StartingPoints from "@/components/Blocks/StartingPoints";

const DashboardRoute: Component = () => {
	// ----------------------------------------
	// Mutations
	const logout = api.auth.useLogout();

	// ----------------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T("dashboard_route_title", {
				name: userStore.get.user?.first_name
					? `, ${userStore.get.user?.first_name}`
					: "",
			})}
			description={T("dashboard_route_description")}
		>
			<Layout.PageContent>
				<StartingPoints />
				<Button
					type="submit"
					theme="primary"
					size="medium"
					loading={logout.action.isPending}
					onClick={() => logout.action.mutate({})}
				>
					{T("logout")}
				</Button>
			</Layout.PageContent>
		</Layout.PageLayout>
	);
};

export default DashboardRoute;
