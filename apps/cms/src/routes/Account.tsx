import T from "@/translations";
import type { Component } from "solid-js";
import userStore from "@/store/userStore";
import Layout from "@/components/Groups/Layout";

const AccountRoute: Component = () => {
	// ----------------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T()("account_route_title")}
			description={T()("account_route_description")}
		>
			<Layout.PageContent>My Account</Layout.PageContent>
		</Layout.PageLayout>
	);
};

export default AccountRoute;
