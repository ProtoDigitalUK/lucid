import T from "@/translations";
import { type Component, createMemo, createSignal, For, Show } from "solid-js";
import useRowTarget from "@/hooks/useRowTarget";
import classNames from "classnames";
import api from "@/services/api";
import userStore from "@/store/userStore";
import UpsertClientIntegrationPanel from "@/components/Panels/ClientIntegrations/UpsertClientIntegrationPanel";
import InfoRow from "@/components/Blocks/InfoRow";
import Layout from "@/components/Groups/Layout";
import ActionDropdown from "@/components/Partials/ActionDropdown";
import DeleteClientIntegration from "@/components/Modals/ClientIntegrations/DeleteClientIntegration";
import CopyAPIKey from "@/components/Modals/ClientIntegrations/CopyAPIKey";
import RegenerateAPIKey from "@/components/Modals/ClientIntegrations/RegenerateAPIKey";

const GeneralSettingsRoute: Component = (props) => {
	// ----------------------------------------
	// State / Hooks
	const rowTarget = useRowTarget({
		triggers: {
			delete: false,
			regenerateAPIKey: false,
			apiKey: false,
			update: false,
		},
	});
	const [getAPIKey, setAPIKey] = createSignal<string | undefined>();
	const [openCreateRolePanel, setOpenCreateRolePanel] = createSignal(false);

	// ----------------------------------
	// Queries
	const clientIntegrations = api.clientIntegrations.useGetAll({
		queryParams: {},
	});

	// ----------------------------------------
	// Memos
	const isLoading = createMemo(() => clientIntegrations.isLoading);
	const isError = createMemo(() => clientIntegrations.isError);
	const isSuccess = createMemo(() => clientIntegrations.isSuccess);

	const hasCreatePermission = createMemo(() => {
		return userStore.get.hasPermission(["create_client_integration"]).all;
	});
	const hasUpdatePermission = createMemo(() => {
		return userStore.get.hasPermission(["update_client_integration"]).all;
	});
	const hasDeletePermission = createMemo(() => {
		return userStore.get.hasPermission(["delete_client_integration"]).all;
	});
	const hasRegeneratePermission = createMemo(() => {
		return userStore.get.hasPermission(["regenerate_client_integration"])
			.all;
	});

	// ----------------------------------------
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
			actions={{
				create: {
					open: openCreateRolePanel(),
					setOpen: setOpenCreateRolePanel,
					permission: hasCreatePermission(),
				},
			}}
			headingChildren={
				<Layout.NavigationTabs
					tabs={[
						{
							label: T()("general"),
							href: "/admin/settings",
						},
						{
							label: T()("client_integrations"),
							href: "/admin/settings/client-integrations",
						},
					]}
				/>
			}
		>
			<Layout.PageContent>
				<InfoRow.Root
					title={T()("client_integrations")}
					description={T()("client_integration_description")}
				>
					<For each={clientIntegrations.data?.data}>
						{(clientIntegration) => (
							<div class="bg-container-2 p-15 rounded-md border border-border mb-2.5 last:mb-0 flex items-center justify-between">
								<div class="flex items-start">
									<span
										class={classNames(
											"w-4 h-4 rounded-full block mr-2.5",
											{
												"bg-primary-base":
													clientIntegration.enabled ===
													1,
												"bg-error-base":
													clientIntegration.enabled ===
													0,
											},
										)}
									/>
									<div>
										<h3
											class={classNames(
												"text-base leading-none",
												{
													"mb-2": clientIntegration.description,
												},
											)}
										>
											{clientIntegration.name} (
											{clientIntegration.key})
										</h3>
										<Show
											when={clientIntegration.description}
										>
											<p class="text-sm mb-0 leading-none">
												{clientIntegration.description}
											</p>
										</Show>
									</div>
								</div>
								<ActionDropdown
									actions={[
										{
											type: "button",
											label: T()("update"),
											onClick: () => {
												rowTarget.setTargetId(
													clientIntegration.id,
												);
												rowTarget.setTrigger(
													"update",
													true,
												);
											},
											permission: hasUpdatePermission(),
										},
										{
											type: "button",
											label: T()("delete"),
											onClick: () => {
												rowTarget.setTargetId(
													clientIntegration.id,
												);
												rowTarget.setTrigger(
													"delete",
													true,
												);
											},
											permission: hasDeletePermission(),
										},
										{
											type: "button",
											label: T()("regenerate_api_key"),
											onClick: () => {
												rowTarget.setTargetId(
													clientIntegration.id,
												);
												rowTarget.setTrigger(
													"regenerateAPIKey",
													true,
												);
											},
											permission:
												hasRegeneratePermission(),
										},
									]}
								/>
							</div>
						)}
					</For>
				</InfoRow.Root>
				{/* Panels & Modals */}
				<DeleteClientIntegration
					id={rowTarget.getTargetId}
					state={{
						open: rowTarget.getTriggers().delete,
						setOpen: (state: boolean) => {
							rowTarget.setTrigger("delete", state);
						},
					}}
				/>
				<UpsertClientIntegrationPanel
					state={{
						open: openCreateRolePanel(),
						setOpen: setOpenCreateRolePanel,
					}}
					callbacks={{
						onCreateSuccess: (key) => {
							setAPIKey(key);
							rowTarget.setTrigger("apiKey", true);
						},
					}}
				/>
				<UpsertClientIntegrationPanel
					id={rowTarget.getTargetId}
					state={{
						open: rowTarget.getTriggers().update,
						setOpen: (state: boolean) => {
							rowTarget.setTrigger("update", state);
						},
					}}
				/>
				<CopyAPIKey
					apiKey={getAPIKey()}
					state={{
						open: rowTarget.getTriggers().apiKey,
						setOpen: (state: boolean) => {
							rowTarget.setTrigger("apiKey", state);
						},
					}}
					callbacks={{
						onClose: () => {
							setAPIKey(undefined);
						},
					}}
				/>
				<RegenerateAPIKey
					id={rowTarget.getTargetId}
					state={{
						open: rowTarget.getTriggers().regenerateAPIKey,
						setOpen: (state: boolean) => {
							rowTarget.setTrigger("regenerateAPIKey", state);
						},
					}}
					callbacks={{
						onSuccess: (key) => {
							setAPIKey(key);
							rowTarget.setTrigger("apiKey", true);
						},
					}}
				/>
			</Layout.PageContent>
		</Layout.PageLayout>
	);
};

export default GeneralSettingsRoute;
