import T from "@/translations";
import { type Component, createSignal } from "solid-js";
import useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import userStore from "@/store/userStore";
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";
import RolesTable from "@/components/Tables/RolesTable";
import UpsertRolePanel from "@/components/Panels/Role/UpsertRolePanel";

const RolesListRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const searchParams = useSearchParamsLocation(
		{
			filters: {
				name: {
					value: "",
					type: "text",
				},
			},
			sorts: {
				name: undefined,
				createdAt: undefined,
			},
		},
		{
			singleSort: true,
		},
	);
	const [openCreateRolePanel, setOpenCreateRolePanel] = createSignal(false);

	// ----------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T()("roles_route_title")}
			description={T()("roles_route_description")}
			options={{
				noBorder: true,
			}}
			actions={{
				create: {
					open: openCreateRolePanel(),
					setOpen: setOpenCreateRolePanel,
					permission: userStore.get.hasPermission(["create_role"])
						.all,
				},
			}}
			headingChildren={
				<Query.Row
					searchParams={searchParams}
					filters={[
						{
							label: T()("name"),
							key: "name",
							type: "text",
						},
					]}
					sorts={[
						{
							label: T()("name"),
							key: "name",
						},
						{
							label: T()("created_at"),
							key: "createdAt",
						},
					]}
					perPage={[]}
				/>
			}
		>
			<RolesTable
				searchParams={searchParams}
				state={{
					setOpenCreateRolePanel: setOpenCreateRolePanel,
				}}
			/>
			<UpsertRolePanel
				state={{
					open: openCreateRolePanel(),
					setOpen: setOpenCreateRolePanel,
				}}
			/>
		</Layout.PageLayout>
	);
};

export default RolesListRoute;
