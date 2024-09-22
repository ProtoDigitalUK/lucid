import T from "@/translations";
import { createMemo, type Component } from "solid-js";
import userStore from "@/store/userStore";
import Alert from "@/components/Blocks/Alert";
import Page from "@/components/Groups/Page";
import Headers from "@/components/Groups/Headers";
import PageContent from "@/components/Groups/PageContent";

const AccountRoute: Component = () => {
	// ----------------------------------------
	// Memos
	const user = createMemo(() => userStore.get.user);

	// ----------------------------------------
	// Render
	return (
		<Page.Layout
			slots={{
				topBar: (
					<Alert
						style="layout"
						alerts={[
							{
								type: "error",
								message: T()("please_reset_password_message"),
								show: user()?.triggerPasswordReset === 1,
							},
						]}
					/>
				),
				header: (
					<Headers.Standard
						copy={{
							title: T()("account_route_title"),
							description: T()("account_route_description"),
						}}
					/>
				),
			}}
		>
			<PageContent.Account />
		</Page.Layout>
	);
};

export default AccountRoute;
