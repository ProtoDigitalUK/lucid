import T from "@/translations";
import type { Component } from "solid-js";
import userStore from "@/store/userStore";
import { FaSolidCode } from "solid-icons/fa";
import constants from "@/constants";
import Layout from "@/components/Groups/Layout";
import StartingPoints from "@/components/Blocks/StartingPoints";
import Alert from "@/components/Blocks/Alert";

const DashboardRoute: Component = () => {
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
				},
			}}
		>
			<Layout.PageContent>
				<Alert
					alerts={[
						{
							type: "warning",
							message:
								"Media support is currently disabled due to no config stategy being present. Please add one to allow media to work.",
						},
						{
							type: "warning",
							message:
								"Email support is currently disabled due to no config stategy being present. Please add one to allow emails to work.",
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
							href: "/collections",
							icon: "collection",
						},
						{
							title: T()("starting_point_media"),
							description: T()(
								"starting_point_media_description",
							),
							href: "/media",
							icon: "media",
						},
						{
							title: T()("starting_point_emails"),
							description: T()(
								"starting_point_emails_description",
							),
							href: "/emails",
							icon: "email",
						},
						{
							title: T()("starting_point_users"),
							description: T()(
								"starting_point_users_description",
							),
							href: "/users",
							icon: "users",
						},
						{
							title: T()("starting_point_roles"),
							description: T()(
								"starting_point_roles_description",
							),
							href: "/roles",
							icon: "roles",
						},
						{
							title: T()("starting_point_settings"),
							description: T()(
								"starting_point_settings_description",
							),
							href: "/settings",
							icon: "settings",
						},
					]}
				/>
			</Layout.PageContent>
		</Layout.PageLayout>
	);
};

export default DashboardRoute;
