import T from "@/translations";
import type { Component } from "solid-js";
import userStore from "@/store/userStore";
import api from "@/services/api";
import { FaSolidCode } from "solid-icons/fa";
import constants from "@/constants";
import Layout from "@/components/Groups/Layout";
import StartingPoints from "@/components/Blocks/StartingPoints";
import Alert from "@/components/Blocks/Alert";

const DashboardRoute: Component = () => {
	// ----------------------------------------
	// Queries / Mutations
	const settings = api.settings.useGetSettings({
		queryParams: {},
	});

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
			actions={{
				link: {
					href: constants.documentationUrl,
					label: T()("documentation"),
					permission: true,
					icon: <FaSolidCode />,
					newTab: true,
				},
			}}
		>
			<Layout.PageContent>
				<Alert
					style="block"
					alerts={[
						{
							type: "warning",
							message: T()("media_support_config_stategy_error"),
							show: settings.data?.data.media.enabled === false,
						},
						{
							type: "warning",
							message: T()("email_support_config_stategy_error"),
							show: settings.data?.data.email.enabled === false,
						},
					]}
				/>
				<StartingPoints
					links={[
						{
							title: T()("starting_point_collections"),
							description: T()(
								"starting_point_collections_description",
							),
							href: "/admin/collections",
							icon: "collection",
						},
						{
							title: T()("starting_point_media"),
							description: T()(
								"starting_point_media_description",
							),
							href: "/admin/media",
							icon: "media",
						},
						{
							title: T()("starting_point_emails"),
							description: T()(
								"starting_point_emails_description",
							),
							href: "/admin/emails",
							icon: "email",
						},
						{
							title: T()("starting_point_users"),
							description: T()(
								"starting_point_users_description",
							),
							href: "/admin/users",
							icon: "users",
						},
						{
							title: T()("starting_point_roles"),
							description: T()(
								"starting_point_roles_description",
							),
							href: "/admin/roles",
							icon: "roles",
						},
						{
							title: T()("starting_point_settings"),
							description: T()(
								"starting_point_settings_description",
							),
							href: "/admin/settings",
							icon: "settings",
						},
					]}
				/>
			</Layout.PageContent>
		</Layout.PageLayout>
	);
};

export default DashboardRoute;
