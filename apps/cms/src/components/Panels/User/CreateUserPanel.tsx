import T from "@/translations";
import { Component, Show, createMemo, createSignal } from "solid-js";
// Store
import userStore from "@/store/userStore";
// Services
import api from "@/services/api";
// Types
import { SelectMultipleValueT } from "@/components/Groups/Form/SelectMultiple";
// Components
import Panel from "@/components/Groups/Panel";
import Form from "@/components/Groups/Form";
import InputGrid from "@/components/Containers/InputGrid";

interface CreateUserPanelProps {
	state: {
		open: boolean;
		setOpen: (_state: boolean) => void;
	};
}

const CreateUserPanel: Component<CreateUserPanelProps> = (props) => {
	// ------------------------------
	// State
	const [getSelectedRoles, setSelectedRoles] = createSignal<
		SelectMultipleValueT[]
	>([]);
	const [getUsername, setUsername] = createSignal<string>("");
	const [getFirstName, setFirstName] = createSignal<string>("");
	const [getLastName, setLastName] = createSignal<string>("");
	const [getEmail, setEmail] = createSignal<string>("");
	const [getPassword, setPassword] = createSignal<string>("");
	const [getPasswordConfirmation, setPasswordConfirmation] =
		createSignal<string>("");
	const [getIsSuperAdmin, setIsSuperAdmin] = createSignal<boolean>(false);

	// ---------------------------------
	// Queries
	const roles = api.roles.useGetMultiple({
		queryParams: {
			include: {
				permissions: false,
			},
			perPage: -1,
		},
		enabled: () => props.state.open,
	});

	// ---------------------------------
	// Mutations
	const createUser = api.users.useCreateSingle({
		onSuccess: () => {
			props.state.setOpen(false);
		},
	});

	// ---------------------------------
	// Effects

	// ---------------------------------
	// Memos
	const isLoading = createMemo(() => {
		return roles.isLoading;
	});
	const isError = createMemo(() => {
		return roles.isError;
	});

	// ---------------------------------
	// Render
	return (
		<Panel.Root
			open={props.state.open}
			setOpen={props.state.setOpen}
			onSubmit={() => {
				createUser.action.mutate({
					body: {
						email: getEmail(),
						password: getPassword(),
						password_confirmation: getPasswordConfirmation(),
						username: getUsername(),
						first_name: getFirstName() || undefined,
						last_name: getLastName() || undefined,
						super_admin: userStore.get.user?.super_admin
							? getIsSuperAdmin()
							: undefined,
						role_ids: getSelectedRoles().map(
							(role) => role.value,
						) as number[],
					},
				});
			}}
			reset={() => {
				createUser.reset();
				setUsername("");
				setFirstName("");
				setLastName("");
				setEmail("");
				setPassword("");
				setIsSuperAdmin(false);
				setSelectedRoles([]);
			}}
			fetchState={{
				isLoading: isLoading(),
				isError: isError(),
			}}
			mutateState={{
				isLoading: createUser.action.isPending,
				errors: createUser.errors(),
			}}
			content={{
				title: T("create_user_panel_title"),
				description: T("create_user_panel_description"),
				submit: T("create"),
			}}
		>
			{() => (
				<>
					<Form.Input
						id="username"
						value={getUsername()}
						onChange={setUsername}
						name={"username"}
						type="text"
						copy={{
							label: T("username"),
						}}
						required={true}
						errors={createUser.errors()?.errors?.body?.username}
					/>
					<InputGrid columns={2}>
						<Form.Input
							id="first_name"
							value={getFirstName()}
							onChange={setFirstName}
							name={"first_name"}
							type="text"
							copy={{
								label: T("first_name"),
							}}
							noMargin={true}
							errors={
								createUser.errors()?.errors?.body?.first_name
							}
						/>
						<Form.Input
							id="last_name"
							value={getLastName()}
							onChange={setLastName}
							name={"last_name"}
							type="text"
							copy={{
								label: T("last_name"),
							}}
							noMargin={true}
							errors={
								createUser.errors()?.errors?.body?.last_name
							}
						/>
					</InputGrid>
					<InputGrid columns={1}>
						<Form.Input
							id="email"
							value={getEmail()}
							onChange={setEmail}
							name={"email"}
							type="text"
							copy={{
								label: T("email"),
							}}
							noMargin={true}
							required={true}
							errors={createUser.errors()?.errors?.body?.email}
						/>
						<Form.Input
							id="password"
							value={getPassword()}
							onChange={setPassword}
							name={"password"}
							type="password"
							copy={{
								label: T("password"),
							}}
							noMargin={true}
							required={true}
							errors={createUser.errors()?.errors?.body?.password}
						/>
						<Form.Input
							id="password_confirmation"
							value={getPasswordConfirmation()}
							onChange={setPasswordConfirmation}
							name={"password_confirmation"}
							type="password"
							copy={{
								label: T("password_confirmation"),
								describedBy: T("password_description"),
							}}
							noMargin={true}
							required={true}
							errors={
								createUser.errors()?.errors?.body
									?.password_confirmation
							}
						/>
					</InputGrid>
					<Form.SelectMultiple
						id="role_ids"
						values={getSelectedRoles()}
						onChange={setSelectedRoles}
						name={"role_ids"}
						copy={{
							label: T("roles"),
						}}
						options={
							roles.data?.data.map((role) => {
								return {
									value: role.id,
									label: role.name,
								};
							}) || []
						}
						errors={createUser.errors()?.errors?.body?.role_ids}
					/>
					<Show when={userStore.get.user?.super_admin}>
						<Form.Checkbox
							id="super_admin"
							value={getIsSuperAdmin()}
							onChange={setIsSuperAdmin}
							name={"super_admin"}
							copy={{
								label: T("is_super_admin"),
							}}
							errors={
								createUser.errors()?.errors?.body?.super_admin
							}
						/>
					</Show>
				</>
			)}
		</Panel.Root>
	);
};

export default CreateUserPanel;
