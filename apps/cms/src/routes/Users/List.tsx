import T from "@/translations";
import { type Component, createSignal } from "solid-js";
import userStore from "@/store/userStore";
import useSearchParams from "@/hooks/useSearchParams";
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
				firstName: {
					value: "",
					type: "text",
				},
				lastName: {
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
				notId: {
					value: userStore.get.user?.id,
					type: "number",
				},
			},
			sorts: {
				createdAt: undefined,
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
			title={T()("users_route_title")}
			description={T()("users_route_description")}
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
							label: T()("first_name"),
							key: "firstName",
							type: "text",
						},
						{
							label: T()("last_name"),
							key: "lastName",
							type: "text",
						},
						{
							label: T()("email"),
							key: "email",
							type: "text",
						},
						{
							label: T()("username"),
							key: "username",
							type: "text",
						},
					]}
					sorts={[
						{
							label: T()("created_at"),
							key: "createdAt",
						},
					]}
					perPage={[]}
				/>
			}
		>
			<UsersTable
				searchParams={searchParams}
				state={{
					setOpenCreateUserPanel: setOpenCreateUserPanel,
				}}
			/>
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
