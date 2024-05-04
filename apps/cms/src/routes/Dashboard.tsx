import T from "@/translations";
import type { Component } from "solid-js";
import api from "@/services/api";
import userStore from "@/store/userStore";
import Button from "@/components/Partials/Button";
import Layout from "@/components/Groups/Layout";

const DashboardRoute: Component = () => {
	// ----------------------------------------
	// Mutations
	const logout = api.auth.useLogout();

	// ----------------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T("dashboard_route_title", {
				name: userStore.get.user?.firstName
					? `, ${userStore.get.user?.firstName}`
					: "",
			})}
			description={T("dashboard_route_description")}
		>
			<Layout.PageContent>
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
