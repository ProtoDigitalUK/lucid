import T from "@/translations";
import { type Component, createSignal } from "solid-js";
import useSearchParamsLocation from "@/hooks/useSearchParamsLocation";
import userStore from "@/store/userStore";
import Query from "@/components/Groups/Query";
import UpsertRolePanel from "@/components/Panels/Role/UpsertRolePanel";
import Page from "@/components/Groups/Page";
import Headers from "@/components/Groups/Headers";
import PageContent from "@/components/Groups/PageContent";

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
		<Page.Layout
			slots={{
				header: (
					<Headers.Standard
						copy={{
							title: T()("roles_route_title"),
							description: T()("roles_route_description"),
						}}
						actions={{
							create: {
								open: openCreateRolePanel(),
								setOpen: setOpenCreateRolePanel,
								permission: userStore.get.hasPermission([
									"create_role",
								]).all,
							},
						}}
						slots={{
							bottom: (
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
							),
						}}
					/>
				),
			}}
		>
			<PageContent.RolesList
				state={{
					searchParams: searchParams,
					setOpenCreateRolePanel: setOpenCreateRolePanel,
				}}
			/>
			{/* Modals */}
			<UpsertRolePanel
				state={{
					open: openCreateRolePanel(),
					setOpen: setOpenCreateRolePanel,
				}}
			/>
		</Page.Layout>
	);
};

export default RolesListRoute;
