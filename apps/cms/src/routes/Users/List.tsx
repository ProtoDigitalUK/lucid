import T from "@/translations";
import { Component, createSignal } from "solid-js";
// Store
import userStore from "@/store/userStore";
// Hooks
import useSearchParams from "@/hooks/useSearchParams";
// Componetns
import Layout from "@/components/Groups/Layout";
import Query from "@/components/Groups/Query";
import UsersTable from "@/components/Tables/UsersTable";
import CreateUserPanel from "@/components/Panels/User/CreateUserPanel";

const UsersListRoute: Component = () => {
	// ----------------------------------
	// Hooks & State
	const searchParams = useSearchParams(
		{
			filters: {
				first_name: {
					value: "",
					type: "text",
				},
				last_name: {
					value: "",
					type: "text",
				},
				email: {
					value: "",
					type: "text",
				},
				username: {
					value: "",
					type: "text",
				},
			},
			sorts: {
				created_at: undefined,
			},
		},
		{
			singleSort: true,
		},
	);
	const [openCreateUserPanel, setOpenCreateUserPanel] = createSignal(false);

	// ----------------------------------
	// Render
	return (
		<Layout.PageLayout
			title={T("users_route_title")}
			description={T("users_route_description")}
			options={{
				noBorder: true,
			}}
			actions={{
				create: {
					open: openCreateUserPanel(),
					setOpen: setOpenCreateUserPanel,
					permission: userStore.get.hasPermission(["create_user"])
						.all,
				},
			}}
			headingChildren={
				<Query.Row
					searchParams={searchParams}
					filters={[
						{
							label: T("first_name"),
							key: "first_name",
							type: "text",
						},
						{
							label: T("last_name"),
							key: "last_name",
							type: "text",
						},
						{
							label: T("email"),
							key: "email",
							type: "text",
						},
						{
							label: T("username"),
							key: "username",
							type: "text",
						},
					]}
					sorts={[
						{
							label: T("created_at"),
							key: "created_at",
						},
					]}
					perPage={[]}
				/>
			}
		>
			<UsersTable searchParams={searchParams} />
			<CreateUserPanel
				state={{
					open: openCreateUserPanel(),
					setOpen: setOpenCreateUserPanel,
				}}
			/>
		</Layout.PageLayout>
	);
};

export default UsersListRoute;
