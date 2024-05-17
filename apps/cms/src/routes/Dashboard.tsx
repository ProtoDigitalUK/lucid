import T from "@/translations";
import type { Component } from "solid-js";
import api from "@/services/api";
import userStore from "@/store/userStore";
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
			title={T()("dashboard_route_title", {
				name: userStore.get.user?.firstName
					? `, ${userStore.get.user?.firstName}`
					: "",
			})}
			description={T()("dashboard_route_description")}
		>
			<Layout.PageContent>
				<StartingPoints
					links={[
						{
							title: T()("starting_point_collections"),
							description: T()(
								"starting_point_collections_description",
							),
							href: "/collections",
						},
						{
							title: T()("starting_point_media"),
							description: T()(
								"starting_point_media_description",
							),
							href: "/media",
						},
						{
							title: T()("starting_point_emails"),
							description: T()(
								"starting_point_emails_description",
							),
							href: "/emails",
						},
						{
							title: T()("starting_point_users"),
							description: T()(
								"starting_point_users_description",
							),
							href: "/users",
						},
						{
							title: T()("starting_point_roles"),
							description: T()(
								"starting_point_roles_description",
							),
							href: "/roles",
						},
						{
							title: T()("starting_point_settings"),
							description: T()(
								"starting_point_settings_description",
							),
							href: "/settings",
						},
					]}
				/>
				<Button
					type="submit"
					theme="primary"
					size="medium"
					loading={logout.action.isPending}
					onClick={() => logout.action.mutate({})}
				>
					{T()("logout")}
				</Button>
			</Layout.PageContent>
		</Layout.PageLayout>
	);
};

export default DashboardRoute;
